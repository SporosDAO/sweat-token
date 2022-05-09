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
            // EIP712
            interfaceId == type(EIP712).interfaceId ||
            // ERC1155
            interfaceId == type(IERC1155).interfaceId ||
            interfaceId == type(IERC1155MetadataURI).interfaceId ||
            super.supportsInterface(interfaceId);
    }

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
