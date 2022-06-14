// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.14;

/// @notice Sporos DAO project manager interface
interface IProjectManager {

    /**
        @notice a DAO authorized manager can order mint of tokens to contributors within the project limits.
     */
    function mintTokens(address to, uint256 amount) external payable;

    // Future versions will support tribute of work in exchange for tokens
    // function submitTribute(address fromContributor, bytes[] nftTribute, uint256 requestedRewardAmount) external payable;
    // function processTribute(address contributor, bytes[] nftTribute, uint256 rewardAmount) external payable;
}
