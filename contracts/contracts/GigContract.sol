//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./GigStore.sol";

contract GigContract is GigStore {
    constructor(
        address owner,
        string memory uri,
        string memory name,
        string memory version
    ) GigContractRoles(owner) GigStore(uri, name, version) {}

    function submitBid(address fromContributor) public {}

    function cancelBid(address fromContributor) public {}

    function acceptBid(address fromContributor) public {}

    function acceptGig(uint256 terms) public onlyRole(ROLE_CONTRIBUTOR) {}

    function submitProofOfWork(address fromContributor, uint256 proofOfWork)
        public
    {}

    function releaseRewards(address toContributor, uint256 proofOfWork)
        public
        onlyRole(ROLE_PROJECT_MANGER)
    {}
}
