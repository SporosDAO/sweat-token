// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.4;

/// @notice Sporos DAO tribute project manager interface
interface ITributeProject {
    function submitTribute(address fromContributor, bytes[] nftTribute, uint256 requestedRewardAmount) external payable;
    function processTribute(address contributor, bytes[] nftTribute, uint256 rewardAmount) external payable;
}
