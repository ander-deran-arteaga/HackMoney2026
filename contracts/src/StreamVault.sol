// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "openzeppelin-contracts/contracts/utils/Pausable.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {Ownable2Step} from "openzeppelin-contracts/contracts/access/Ownable2Step.sol";
import {ITeller} from "./IYieldAdapter.sol";


/** Invariants
 * claimed <= accrued <= funded (never pay more that what has been funded).
 * claim() only transfer to payee.
 * fund() increments funded and never reduces anything.
 * cancel() fix end = min(end, now) y detiene el devengo.
 * If rate == 0 or end <= start → revert (no streams inválits).
 * **/

contract StreamVault is ReentrancyGuard, Pausable, Ownable2Step {
    using SafeERC20 for IERC20;

    struct Stream {
      address payer;
      address payee;
      uint40  start;
      uint40  end;
      uint256  rate;     // USDC per second, 6 decimals
      uint128 funded;   // total funded
      uint128 claimed;  // total claimed
      bool    canceled;
      bool    closed;
    }

    IERC20 public immutable USDC;

    uint256 public nextId;
    mapping(uint256 => Stream) public streams;

    // For buffer logic later
    uint256 public totalRate;       // sum of rates for active streams
    uint32 public bufferDays = 3;

    // yield config
    bool public yieldEnabled = false;
    address public teller;
    address public usyc;
    uint16 public perfFeeBps; // e.g. 200 = 2%
    address public feeRecipient;

    // rebalance
    uint40 public lastRebalance;
    uint32 public rebalanceCooldown = 120; // seconds
    uint256 public minEpsilon = 1e6;       // 1 USDC (6 decimals)
    uint16 public epsilonBps = 100;        // 1%

    constructor(address usdc) Ownable(msg.sender) {
      USDC = IERC20(usdc);
    }

    event StreamCreated(uint256 indexed id, address indexed payer, address indexed payee, uint256 rate, uint40 start, uint40 end);
    event StreamFunded(uint256 indexed id, address indexed from, uint256 amount);
    event StreamClaimed(uint256 indexed id, address indexed payee, uint256 amount);
    event StreamCanceled(uint256 indexed id);
    event StreamRefunded(uint256 indexed id, address indexed payer, uint256 amount);
    event StreamFinished(uint256 indexed id);
    event StreamReopened(uint256 indexed id);
    event RebalanceComputed(uint256 buffer, uint256 target, int256 delta);
    event YieldConfigSet(address teller, address usyc);
    event YieldEnabledSet(bool enabled);
    event PerfFeeSet(uint16 bps);
    event YieldDeposited(uint256 amount, uint256 sharesOut);
    event YieldRedeemed(uint256 sharesIn, uint256 assetsOut);
    event RebalanceNoAction(uint256 buffer, uint256 target, int256 delta, string reason);

    error StreamVault__InvalidStream();
    error StreamVault__InvalidAddress();
    error StreamVault__InvalidRate();
    error StreamVault__InvalidTime();
    error StreamVault__AmountZero();
    error StreamVault__AmountTooLarge();
    error StreamVault__AmountTooLow();
    error StreamVault__BadPayer();
    error StreamVault__NotPayee();
    error StreamVault__NothingToClaim();
    error StreamVault__AlreadyCanceled();
    error StreamVault__FundedBelowClaimed();
    error StreamVault__Cancel_NotPayer();
    error StreamVault__Fund_NotPayer();
    error StreamVault__BadFeeBps();
    error StreamVault__YieldNotEnabled();
    error StreamVault__DidNotIncrease();
    error StreamVault__RebalanceCooldown();
    error StreamVault__InsufficientLiquidity(uint256 needed, uint256 available);

    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function _max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    function _getStream(uint256 id) internal view returns (Stream storage s) {
        if (id == 0)
            revert StreamVault__InvalidStream();
        s = streams[id];
        if (s.payer == address(0))
            revert StreamVault__InvalidStream();
    }

    function accrued(uint256 id) public view returns (uint256) {
        Stream storage s = _getStream(id);
        uint256 t = block.timestamp;
        if (t <= s.start) {
            return 0;
        }
        uint256 endT = _min(t, s.end);
        uint256 maxEnd = uint256(s.start) + uint256(s.funded) / s.rate;
        endT = _min(endT, maxEnd);
        if (endT <= s.start)
            return 0;
        return s.rate * (endT - uint256(s.start));
    }

    function claimable(uint256 id) public view returns (uint256) {
        Stream storage s = _getStream(id);
        uint256 a = accrued(id);
        return a <= s.claimed ? 0 : a - s.claimed;
    }

    function createStream(address payee, uint256 rate, uint40 start, uint40 end) external whenNotPaused returns (uint256 id) {
        if (payee == address(0))
            revert StreamVault__InvalidAddress();
        if (rate == 0)
            revert StreamVault__InvalidRate();
        if (end <= start)
            revert StreamVault__InvalidTime();
        id = ++nextId;
        streams[id] = Stream({
            payer: msg.sender,
            payee: payee,
            start: start,
            end: end,
            rate: rate,
            funded: 0,
            claimed: 0,
            canceled: false,
            closed: false
        });
        totalRate += rate;
        emit StreamCreated(id, msg.sender, payee, rate, start, end);
    }

    function fund(uint256 id, uint256 amount) external whenNotPaused nonReentrant {
        Stream storage s = _getStream(id);
        if (msg.sender != s.payer)
            revert StreamVault__Fund_NotPayer();
        _fund(s, id, msg.sender, amount);
    }

    function fundFor(uint256 id, address payer, uint256 amount) external whenNotPaused nonReentrant {
        Stream storage s = _getStream(id);
        if (payer != s.payer)
            revert StreamVault__BadPayer();
        _fund(s, id, msg.sender, amount);
    }

    function _fund(Stream storage s, uint256 id, address from, uint256 amount) internal {
        if (amount == 0)
            revert StreamVault__AmountZero();
        if (amount > type(uint128).max - s.funded)
            revert StreamVault__AmountTooLarge();
        USDC.safeTransferFrom(from, address(this), amount);
        s.funded += uint128(amount);
        if (s.closed && !s.canceled && !_noMoreAccrual(s)) {
            s.closed = false;
            totalRate += s.rate;
            emit StreamReopened(id);
        }

        emit StreamFunded(id, from, amount);
    }

    function claim(uint256 id) external whenNotPaused nonReentrant returns (uint256 paid) {
        Stream storage s = _getStream(id);
        if (msg.sender != s.payee)
            revert StreamVault__NotPayee();
        paid = _claim(s, id);
    }

    function claimOnBehalf(uint256 id) external whenNotPaused nonReentrant returns (uint256 paid) {
        Stream storage s = _getStream(id);
        paid = _claim(s, id);
    }

    function _claim(Stream storage s, uint256 id) internal returns (uint256 paid) {
        paid = claimable(id);
        if (paid == 0)
            revert StreamVault__NothingToClaim();
        s.claimed += uint128(paid);
        _ensureLiquidity(paid);
        USDC.safeTransfer(s.payee, paid);
        emit StreamClaimed(id, s.payee, paid);
    }

    function cancel(uint256 id) external whenNotPaused nonReentrant returns (uint256 refundable) {
        Stream storage s = _getStream(id);
        if (msg.sender != s.payer)
            revert StreamVault__Cancel_NotPayer();
        if (s.canceled == true)
            revert StreamVault__AlreadyCanceled();
        uint40 nowT = uint40(block.timestamp);
        if (nowT < s.end)
            s.end = nowT;
        uint256 a = accrued(id);
        if (a < s.claimed)
            revert StreamVault__FundedBelowClaimed();
        uint256 funded_ = uint256(s.funded);
        refundable = funded_ > a ? funded_ - a : 0;
        if (!s.closed) {
            s.closed = true;
            totalRate -= s.rate;
        }   
        s.canceled = true;
        // recorta funded a lo que realmente queda “reservado” para el payee
        s.funded = uint128(a);
        if (refundable != 0) {
            _ensureLiquidity(refundable);
            USDC.safeTransfer(s.payer, refundable);
            emit StreamRefunded(id, s.payer, refundable);
        }
        emit StreamCanceled(id);
    }

    function _effectiveEnd(Stream storage s) internal view returns (uint256) {
        uint256 maxEnd = uint256(s.start) + uint256(s.funded) / s.rate;
        return _min(uint256(s.end), maxEnd);
    }

    function _noMoreAccrual(Stream storage s) internal view returns (bool) {
        uint256 effEnd = _effectiveEnd(s);
        return block.timestamp >= effEnd;
    }

    function poke(uint256 id) external whenNotPaused nonReentrant returns (bool closedNow) {
        Stream storage s = _getStream(id);
        if (s.canceled == true || s.closed == true)
            return false;
        if (!_noMoreAccrual(s))
            return false;

        s.closed = true;
        totalRate -= s.rate;
        emit StreamFinished(id);
        return true;
    }

    function buffer() public view returns (uint256) {
        return USDC.balanceOf(address(this));
    }

    function bufferTarget() public view returns (uint256) {
        return totalRate * uint256(bufferDays) * 1 days;
    }

    function _epsilon(uint256 target) internal view returns (uint256) {
        uint256 eps = target / 10000 * epsilonBps; // target * bps / 1e4
        if (eps < minEpsilon) eps = minEpsilon;
        return eps;
    }

    function rebalance() external whenNotPaused nonReentrant returns (uint256 b, uint256 t, int256 d) {
        b = buffer();
        t = bufferTarget();
        d = (b >= t) ? int256(b - t) : -int256(t - b);

        // Always emit the computed state (useful for judges + debugging)
        emit RebalanceComputed(b, t, d);

        // safe-by-default: NEVER move funds unless fully configured
        bool canYield = yieldEnabled && teller != address(0) && usyc != address(0);

        // also: if no active streams, don't invest anything (avoid "invest-all" trap)
        if (!canYield || totalRate == 0) {
            return (b, t, d);
        }

        // hysteresis
        uint256 eps = _epsilon(t);
        uint256 absDelta = d >= 0 ? uint256(d) : uint256(-d);
        if (absDelta <= eps) {
            return (b, t, d);
        }

        // cooldown ONLY if we are actually going to act
        if (block.timestamp < uint256(lastRebalance) + uint256(rebalanceCooldown)) {
            revert StreamVault__RebalanceCooldown();
        }
        lastRebalance = uint40(block.timestamp);

        // actions (MVP)
        if (d > 0) {
            // buffer too high: invest surplus
            _yieldDeposit(absDelta);
        } else {
            // buffer too low: redeem (MVP = redeemAll; later implement redeemExact(absDelta))
            // buffer demasiado bajo -> intentar recuperar liquidez
            uint256 shares = IERC20(usyc).balanceOf(address(this));
            if (shares > 0) {
                _yieldRedeemAll(); // MVP: trae todo de vuelta
            } else {//no hay nada invertido
                emit RebalanceNoAction(b, t, d, "no usyc to redeem");
            }
        }
    }

    function setYieldConfig(address _teller, address _usyc) external onlyOwner {
        teller = _teller;
        usyc = _usyc;
        USDC.forceApprove(_teller, type(uint256).max);

        emit YieldConfigSet(_teller, _usyc);
    }

    function setYieldEnabled(bool _yieldEnabled) external onlyOwner {
        yieldEnabled = _yieldEnabled;
        emit YieldEnabledSet(_yieldEnabled);
    }

    function setPerfFeeBps(uint16 _perfFeeBps) external onlyOwner {
        if (_perfFeeBps > 2000)
            revert StreamVault__BadFeeBps(); // max 20%
        perfFeeBps = _perfFeeBps;
        emit PerfFeeSet(_perfFeeBps);
    }

    function _yieldDeposit(uint256 amount) internal returns (uint256 sharesOut) {
        if (!yieldEnabled)
            revert StreamVault__YieldNotEnabled();
        if (amount == 0)
            revert StreamVault__AmountZero();

        uint256 bal = USDC.balanceOf(address(this));
        if (bal < amount)
            revert StreamVault__AmountTooLow();

        uint256 usycBefore = IERC20(usyc).balanceOf(address(this));

        sharesOut = ITeller(teller).deposit(amount, address(this));

        uint256 usycAfter = IERC20(usyc).balanceOf(address(this));

        if (usycAfter <= usycBefore)
            revert StreamVault__DidNotIncrease();

        emit YieldDeposited(amount, sharesOut);
    }

        function yieldDeposit(uint256 amount) external onlyOwner nonReentrant whenNotPaused returns (uint256 sharesOut) {
            return _yieldDeposit(amount);
        }

        function _yieldRedeemAll() internal returns (uint256 assetsOut, uint256 sharesIn) {
        if (!yieldEnabled)
            revert StreamVault__YieldNotEnabled();

        sharesIn = IERC20(usyc).balanceOf(address(this));
        if (sharesIn == 0)
            revert StreamVault__AmountZero();
        uint256 usdcBefore = USDC.balanceOf(address(this));
        uint256 usycBefore = sharesIn;

        assetsOut = ITeller(teller).redeem(sharesIn, address(this), address(this));

        uint256 usdcAfter = USDC.balanceOf(address(this));
        uint256 usycAfter = IERC20(usyc).balanceOf(address(this));

        if (usdcAfter <= usdcBefore)
            revert StreamVault__DidNotIncrease();
        if (usycAfter >= usycBefore)
            revert StreamVault__DidNotIncrease();

        emit YieldRedeemed(sharesIn, assetsOut);
    }

    function yieldRedeemAll() external onlyOwner nonReentrant whenNotPaused returns (uint256 assetsOut, uint256 sharesIn) {
        return _yieldRedeemAll();
    }

    function _ensureLiquidity(uint256 needed) internal {
        if (needed == 0)
         return;
        uint256 bal = USDC.balanceOf(address(this));
        if (bal >= needed)
            return;
        
        bool canYield = yieldEnabled && teller != address(0) && usyc != address(0);
        if (canYield) {
        uint256 shares = IERC20(usyc).balanceOf(address(this));
        if (shares > 0) {
            _yieldRedeemAll(); // intenta traer todo a USDC
            bal = USDC.balanceOf(address(this));
            if (bal >= needed) return;
        }
    }

    revert StreamVault__InsufficientLiquidity(needed, bal);
    }

    function pause() external onlyOwner {
        _pause();
    }
    function unpause() external onlyOwner {
        _unpause();
    }
    function emergencyWithdraw(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(to, amount);
    }
}
