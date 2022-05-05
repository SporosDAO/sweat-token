//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./GigContractRoles.sol";

contract GigContract is GigContractRoles, ERC1155 {
    uint256 public constant TASKS = 0;
    uint256 public constant POW = 1;

    constructor(address owner)
        GigContractRoles(owner)
        ERC1155("https://sweattoken.sporosdao.xyz/resources/{id}.json")
    {}

    /**
     * @dev See {IERC1155-supportsInterface}.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControl, ERC1155)
        returns (bool)
    {
        return
            // AccessControl
            interfaceId == type(IAccessControl).interfaceId ||
            // ERC1155
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function submitBid(address fromContributor) public {}

    function cancelBid(address fromContributor) public {}

    function acceptBid(address fromContributor) public {}

    function offerGig(address toContributor, uint256 terms)
        public
        onlyRole(ROLE_PROJECT_MANGER)
    {}

    function acceptGig(uint256 terms) public onlyRole(ROLE_CONTRIBUTOR) {}

    function submitProofOfWork(address fromContributor, uint256 proofOfWork)
        public
    {}

    function releaseRewards(address toContributor, uint256 proofOfWork)
        public
        onlyRole(ROLE_PROJECT_MANGER)
    {}
}
