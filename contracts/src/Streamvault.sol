// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {ReentrancyGuard} from "openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol";
import {Pausable} from "openzeppelin-contracts/contracts/utils/Pausable.sol";

/** Invariants
 * claimed <= accrued <= funded (never pay more that what has been funded).
 * claim() only transfer to payee.
 * fund() increments funded and never reduces anything.
 * cancel() fix end = min(end, now) y detiene el devengo.
 * If rate == 0 or end <= start → revert (no streams inválits).
 * **/

contract StreamVault is ReentrancyGuard, Pausable {
    using SafeERC20 for IERC20;

    struct Stream {
      address payer;
      address payee;
      uint40  start;
      uint40  end;
      uint96  rate;     // USDC per second, 6 decimals
      uint128 funded;   // total funded
      uint128 claimed;  // total claimed
      bool    canceled;
    }

    IERC20 public immutable USDC;

    uint256 public nextId;
    mapping(uint256 => Stream) public streams;

    // For buffer logic later
    uint96 public totalRate;       // sum of rates for active streams
    uint32 public bufferDays = 3;

    // Admin
    address public owner;

    constructor(address usdc) {
      owner = msg.sender;
      USDC = IERC20(usdc);
    }

    event StreamCreated(uint256 indexed id, address indexed payer, address indexed payee, uint96 rate, uint40 start, uint40 end);
    event StreamFunded(uint256 indexed id, address indexed from, uint256 amount);
    event StreamClaimed(uint256 indexed id, address indexed payee, uint256 amount);
    event StreamCanceled(uint256 indexed id);

    error StreamVault__InvalidStream();
    error StreamVault__InvalidAddress();
    error StreamVault__InvalidRate();
    error StreamVault__InvalidTime();
    error StreamVault__NotPayer();
    error StreamVault__AmountZero();
    error StreamVault__AmountTooLarge();
    error StreamVault__BadPayer();
    error StreamVault__NotPayee();
    error StreamVault__NothingToClaim();
    error StreamVault__AlreadyCanceled();

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
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
        uint256 maxEnd = uint256(s.start) + uint256(s.funded) / uint256(s.rate);
        endT = _min(endT, maxEnd);
        if (endT <= s.start)
            return 0;
        return uint256(s.rate) * (endT - uint256(s.start));
    }

    function claimable(uint256 id) public view returns (uint256) {
        Stream memory s = streams[id];
        uint256 a = accrued(id);
        if (a <= s.claimed)
            return 0;
        return a - s.claimed;
    }

    function createStream(address payee, uint96 rate, uint40 start, uint40 end) external whenNotPaused returns (uint256 id) {
        if (payee == address(0))
            revert StreamVault__InvalidAddress();
        if (rate <= 0)
            revert StreamVault__InvalidRate();
        if (!(end > start))
            revert StreamVault__InvalidTime();
        nextId++;
        streams[nextId] = Stream({
            payer: msg.sender,
            payee: payee,
            start: start,
            end: end,
            rate: rate,
            funded: 0,
            claimed: 0,
            canceled: false
        });
        totalRate += rate;
        emit StreamCreated(id, msg.sender, payee, rate, start, end);
    }

    function fund(uint256 id, uint256 amount) external whenNotPaused nonReentrant {
        Stream storage s = _getStream(id);
        if (msg.sender != s.payer)
            revert StreamVault__NotPayer();
        _fund(s, id, msg.sender, amount);
    }

    function fundFor(uint256 id, address payer, uint256 amount) external whenNotPaused nonReentrant {
        Stream storage s = _getStream(id);
        if (payer == s.payer)
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
        USDC.safeTransfer(s.payee, paid);
        emit StreamClaimed(id, s.payee, paid);
    }

    function cancel(uint256 id) external whenNotPaused nonReentrant {
        Stream storage s = _getStream(id);
        if (msg.sender != s.payer)
            revert StreamVault__NotPayer();
        if (s.canceled == true)
            revert StreamVault__AlreadyCanceled();
        uint40 nowT = uint40(block.timestamp);
        if (nowT < s.end)
            s.end = nowT;
        s.canceled = true;
        totalRate -= s.rate;
        // refund to payer
        emit StreamCanceled(id);
    }

    function pause() external onlyOwner {
        _pause();
    }
    function unpause() external onlyOwner {
        _unpause();
    }

    function emergencyWithdraw(address token, address to, uint256 amount) external onlyOwner {
        IERC20(token).transfer(to, amount);
    }
}
