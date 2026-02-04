// contracts/test/mocks/MockUSYC.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract MockUSYC is ERC20 {
    address public minter;

    constructor() ERC20("Mock USYC", "mUSYC") {}

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    function setMinter(address _minter) external {
        require(minter == address(0), "minter already set");
        minter = _minter;
    }

    function mint(address to, uint256 amount) external {
        require(msg.sender == minter, "not minter");
        _mint(to, amount);
    }

    function burn(address from, uint256 amount) external {
        require(msg.sender == minter, "not minter");
        _burn(from, amount);
    }
}
