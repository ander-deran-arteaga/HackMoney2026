// contracts/test/mocks/MockTeller.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {SafeERC20} from "openzeppelin-contracts/contracts/token/ERC20/utils/SafeERC20.sol";
import {MockUSYC} from "./MockUSYC.sol";

contract MockTeller {
    using SafeERC20 for IERC20;

    IERC20 public immutable usdc;
    MockUSYC public immutable usyc;

    constructor(address _usdc, address _usyc) {
        usdc = IERC20(_usdc);
        usyc = MockUSYC(_usyc);
    }

    // 1:1 deposit: USDC in, USYC out
    function deposit(uint256 assets, address receiver) external returns (uint256 sharesOut) {
        usdc.safeTransferFrom(msg.sender, address(this), assets);
        usyc.mint(receiver, assets);
        return assets;
    }

    // 1:1 redeem: USYC in, USDC out
    function redeem(uint256 shares, address receiver, address owner) external returns (uint256 assetsOut) {
        // owner must have approved teller for USYC
        IERC20(address(usyc)).safeTransferFrom(owner, address(this), shares);
        usyc.burn(address(this), shares);

        usdc.safeTransfer(receiver, shares);
        return shares;
    }

    // helper: fund teller with USDC liquidity for redeem
    function fund(uint256 amount) external {
        usdc.safeTransferFrom(msg.sender, address(this), amount);
    }
}
