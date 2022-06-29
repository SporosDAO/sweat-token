// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.4;

/// @notice Kali DAO share manager interface
interface ITributeProject {
    function processTribute(address contributor, bytes[] nftTribute, uint256 rewardAmount) external payable;
}
