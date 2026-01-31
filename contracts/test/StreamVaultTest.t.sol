// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {StreamVault} from "../src/StreamVault.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";


contract StreamVaultTest is Test {
    StreamVault streamVault;
    MockUSDC usdc;

    address payer = makeAddr("payer");
    address payee = makeAddr("payee");

    function setUp() public {
        usdc = new MockUSDC();
        streamVault = new StreamVault(address(usdc));
        usdc.mint(payer, 1000e6); // 1000 USDC to payer
        // payer approves vault for fund()
        vm.prank(payer);
        IERC20(address(usdc)).approve(address(streamVault), type(uint256).max);
    }

    function testAccruedInTime() public {
        uint96 rate = 1e6; 
        uint40 start = uint40(block.timestamp);
        uint40 end = start + uint40(96 hours);
        vm.prank(payer);
        uint256 id = streamVault.createStream(payee, rate, start, end);
        vm.prank(payer);
        streamVault.fund(id, 10e6); // 10 USDC funded
        vm.warp(start + 5);
        assertEq(streamVault.accrued(id), 5e6); // 5 USDC
        vm.warp(start + 20);
        assertEq(streamVault.accrued(id), 10e6); // capped by funded
    }

    function testClaimReducesClaimable() public {
        uint96 rate = 1e6; 
        uint40 start = uint40(block.timestamp);
        uint40 end = start + uint40(96 hours);
        vm.prank(payer);
        uint256 id = streamVault.createStream(payee, rate, start, end);
        vm.prank(payer);
        streamVault.fund(id, 100e6); // 100 USDC funded
        vm.warp(start + 5);
        assertEq(streamVault.claimable(id), 5e6); // claimable 5 USDC
        vm.prank(payee);
        uint256 claimed = streamVault.claim(id); // claimed 5 USDC
        assertEq(claimed, 5e6);
        assertEq(streamVault.claimable(id), 0); // claimagle 0 USDC
    }

    // cancel stops accrual
    function testCancelStopsAccrual() public {
        uint96 rate = 1e6; 
        uint40 start = uint40(block.timestamp);
        uint40 end = start + uint40(96 hours);

        vm.prank(payer);
        uint256 id = streamVault.createStream(payee, rate, start, end);
        vm.prank(payer);
        streamVault.fund(id, 100e6);
        uint40 cancelT = start + 5;
        vm.warp(cancelT);
        assertEq(streamVault.accrued(id), 5e6);
        vm.prank(payer);
        streamVault.cancel(id);
        (, , , uint40 storedEnd, , , , bool canceled) = streamVault.streams(id);
        assertEq(storedEnd, cancelT);
        assertTrue(canceled);

        vm.warp(start + 10);
        assertEq(streamVault.accrued(id), 5e6);
}

    // fundFor allows executor
    function testFundForAllowsExecutor() public {
        uint96 rate = 1e6; 
        uint40 start = uint40(block.timestamp);
        uint40 end = start + uint40(96 hours);
        address executor = makeAddr("executor");

        vm.prank(payer);
        uint256 id = streamVault.createStream(payee, rate, start, end);

        // executor has the funds + approves the vault (LI.FI-like)
        usdc.mint(executor, 100e6);
        vm.prank(executor);
        IERC20(address(usdc)).approve(address(streamVault), type(uint256).max);

        // executor funds, but payer attribution must match stream.payer
        vm.prank(executor);
        streamVault.fundFor(id, payer, 100e6);
        (, , , , , uint128 funded , , ) = streamVault.streams(id);
        assertEq(funded, 100e6);
    }
}