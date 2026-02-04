// SPDX-License-Identifier: MIT

pragma solidity 0.8.24;

import {StreamVault} from "../src/StreamVault.sol";
import {Script, console2} from "forge-std/Script.sol";

contract DeployStreamVault is Script {
    function run() public { 
        uint256 pk = vm.envUint("PRIVATE_KEY");
        address usdc = vm.envAddress("USDC");
        vm.startBroadcast(pk);
        StreamVault vault = new StreamVault(usdc);
        vm.stopBroadcast();

        console2.log("StreamVault:", address(vault));
    }
}