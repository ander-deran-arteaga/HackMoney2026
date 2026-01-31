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

    modifier onlyOwner() {
        require(msg.sender == owner, "not owner");
        _;
    }

    function _min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function accrued(uint256 id) public view returns (uint256) {
        if (id == 0 || id > nextId) {
            revert StreamVault__InvalidStream();
        }
        Stream storage s = streams[id];
        if (s.payer == address(0))
            revert StreamVault__InvalidStream();
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
}
