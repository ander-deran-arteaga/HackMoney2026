// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import {Test, console} from "forge-std/Test.sol";
import {StreamVault} from "../src/StreamVault.sol";
import {MockUSDC} from "./mocks/MockUSDC.sol";
import {MockUSYC} from "./mocks/MockUSYC.sol";
import {MockTeller} from "./mocks/MockTeller.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract StreamVaultTest is Test {
    StreamVault streamVault;
    MockTeller teller;
    MockUSDC usdc;
    MockUSYC usyc;

    address payer = makeAddr("payer");
    address payee = makeAddr("payee");

    function setUp() public {
        usdc = new MockUSDC();
        usyc = new MockUSYC();
        teller = new MockTeller(address(usdc), address(usyc));
        streamVault = new StreamVault(address(usdc));
        usdc.mint(payer, 1000e6); // 1000 USDC to payer
        // payer approves vault for fund()
        vm.prank(payer);
        IERC20(address(usdc)).approve(address(streamVault), type(uint256).max);
        usyc.setMinter(address(teller));
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
        uint256 payerBalBefore = usdc.balanceOf(payer);
        vm.prank(payer);
        uint256 refunded = streamVault.cancel(id);
        assertEq(refunded, 95e6);
        uint256 payerBalAfter = usdc.balanceOf(payer);
        assertEq(payerBalAfter - payerBalBefore, 95e6);
        (, , , uint40 storedEnd, , , , bool canceled,) = streamVault.streams(id);
        assertEq(storedEnd, cancelT); 
        assertTrue(canceled); 

        vm.warp(start + 10);
        assertEq(streamVault.accrued(id), 5e6); // cancel congela devengo
        vm.prank(payee);
        uint256 claimed = streamVault.claim(id);    
        assertEq(claimed, 5e6); // payee conserva derecho de cobro
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
        (, , , , , uint128 funded , , ,) = streamVault.streams(id);
        assertEq(funded, 100e6);
    }

    function testPause() public {
        uint96 rate = 1e6; 
        uint40 start = uint40(block.timestamp);
        uint40 end = start + uint40(96 hours);
        address attacker = makeAddr("attacker");

        vm.prank(payer);
        uint256 id = streamVault.createStream(payee, rate, start, end);
        vm.prank(payer);
        streamVault.fund(id, 100e6);
        uint40 pausedTime = start + 5;
        vm.warp(pausedTime);
        vm.prank(attacker);
        vm.expectRevert();
        streamVault.pause(); // Reverted

        streamVault.pause(); // called by msg.sender that also called the contract so no revert
        vm.expectRevert();
        streamVault.cancel(id);
    }

    // claimed <= accrued <= funded always
    function testInvariants(uint96 randomRate, uint40 randomStartTime, uint40 randomEndTime) public {
        uint96 rate = uint96(bound(uint256(randomRate), 1e6, 5e6));
        uint40 start = uint40(bound(uint256(randomStartTime), block.timestamp, block.timestamp + 96 hours));
        uint40 end   = uint40(bound(uint256(randomEndTime), start + 1, start + 96 hours));

        vm.prank(payer);
        uint256 id = streamVault.createStream(payee, rate, start, end);

        vm.prank(payer);
        streamVault.fund(id, 100e6);

        uint40 t = start + 5;
        vm.warp(t);
        uint256 endT = t < end ? t : end;
        uint256 expected = endT <= start ? 0 : uint256(rate) * (endT - start);

        assertEq(streamVault.accrued(id), expected);
    }

    function testPokeCloseCorrectlyByTime() public {
        uint96 rate = 1e6; 
        uint40 start = uint40(block.timestamp);
        uint40 end = start + uint40(24 hours);

        vm.prank(payer);
        uint256 id = streamVault.createStream(payee, rate, start, end);
        vm.prank(payer);
        streamVault.fund(id, 100e6);
        vm.warp(start + 25 hours);
        streamVault.poke(id);
        ( , , , , , , , , bool closed) = streamVault.streams(id);
        assertEq(closed, true);
    }

    function testOutOfFundsThenPokeThenFundAndReopens() public {
        uint96 rate = 1e6; 
        uint40 start = uint40(block.timestamp);
        uint40 end = start + uint40(24 hours);

        vm.prank(payer);
        uint256 id = streamVault.createStream(payee, rate, start, end);
        vm.prank(payer);
        streamVault.fund(id, 3e6);
        vm.warp(start + 5);
        streamVault.poke(id);
        ( , , , , , , , , bool closed) = streamVault.streams(id);
        assertEq(closed, true);
        vm.prank(payer);
        streamVault.fund(id, 100e6);
        streamVault.poke(id);
        ( , , , , , , , , closed) = streamVault.streams(id);
        assertEq(closed, false);
    }

    function testRebalanceDepositsWhenBufferAboveTarget() public {
        // rate pequeño -> target < buffer
        uint256 rate = 100; // 0.000100 USDC/s
        uint40 start = uint40(block.timestamp);
        uint40 end = start + uint40(24 hours);

        vm.prank(payer);
        uint256 id = streamVault.createStream(payee, rate, start, end);

        vm.prank(payer);
        streamVault.fund(id, 100e6); // 100 USDC al vault

        // onlyOwner (asumiendo owner == address(this) en setUp)
        streamVault.setYieldConfig(address(teller), address(usyc));
        streamVault.setYieldEnabled(true);

        uint256 usdcBefore = IERC20(address(usdc)).balanceOf(address(streamVault));
        uint256 usycBefore = IERC20(address(usyc)).balanceOf(address(streamVault));
        // optional: pasar cooldown si lo tienes
        vm.warp(block.timestamp + 10_000);

        streamVault.rebalance();

        uint256 usdcAfter = IERC20(address(usdc)).balanceOf(address(streamVault));
        uint256 usycAfter = IERC20(address(usyc)).balanceOf(address(streamVault));
        assertGt(usycAfter, usycBefore);     // se invirtió -> sube USYC
        assertLt(usdcAfter, usdcBefore);     // baja USDC en vault
    }

    
    function testClaimPullsLiquidityFromYield() public {
        // --- arrange ---
        uint256 rate = 1e6; // 1 USDC/s
        uint40 start = uint40(block.timestamp);
        uint40 end = start + uint40(1 days);

        vm.prank(payer);
        uint256 id = streamVault.createStream(payee, rate, start, end);

        // fund stream with 100 USDC
        vm.prank(payer);
        streamVault.fund(id, 100e6);

        // enable yield + set mocks
        streamVault.setYieldConfig(address(teller), address(usyc));
        streamVault.setYieldEnabled(true);

        // invest almost all USDC, leave only 0.1 USDC buffer
        // 100e6 - 99_900_000 = 100_000 (0.1 USDC)
        streamVault.yieldDeposit(99_900_000);

        assertEq(usdc.balanceOf(address(streamVault)), 100_000);
        assertGt(usyc.balanceOf(address(streamVault)), 0);

        // make claimable = 1 USDC (1 second * rate)
        vm.warp(start + 1);

        // --- act ---
        vm.prank(payee);
        uint256 paid = streamVault.claim(id);

        // --- assert ---
        assertEq(paid, 1e6);
        assertEq(usdc.balanceOf(payee), 1e6); // payee got paid
        // optional: with MVP redeemAll, vault likely pulled back a lot of USDC
        assertGt(usdc.balanceOf(address(streamVault)), 0);
    }

    function testCancelRefundPullsLiquidityFromYield() public {
        // --- arrange ---
        uint256 rate = 1e6; // 1 USDC/s
        uint40 start = uint40(block.timestamp);
        uint40 end = start + uint40(1 days);

        vm.prank(payer);
        uint256 id = streamVault.createStream(payee, rate, start, end);

        // fund stream with 100 USDC
        vm.prank(payer);
        streamVault.fund(id, 100e6);

        // enable yield + set mocks
        streamVault.setYieldConfig(address(teller), address(usyc));
        streamVault.setYieldEnabled(true);

        // invest almost all USDC, leave only 0.1 USDC buffer
        // 100e6 - 99_900_000 = 100_000 (0.1 USDC)
        streamVault.yieldDeposit(99_900_000);

        assertEq(usdc.balanceOf(address(streamVault)), 100_000);
        assertGt(usyc.balanceOf(address(streamVault)), 0);

        // make claimable = 1 USDC (1 second * rate)
        vm.warp(start + 1);

        vm.prank(payer);
        streamVault.cancel(id);
        assertEq(usdc.balanceOf(address(streamVault)), 1e6); // what has to claim the payee
        assertEq(usdc.balanceOf(address(payer)), 999000000); // what was yielded
    }
}