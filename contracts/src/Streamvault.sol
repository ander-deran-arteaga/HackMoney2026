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

contract StreamVault {

}
