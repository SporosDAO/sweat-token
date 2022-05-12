//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract GigContractRoles is AccessControl, Ownable {
    bytes32 public constant ROLE_PROJECT_MANGER = keccak256("PROJECT_MANGER");
    bytes32 public constant ROLE_CONTRIBUTOR = keccak256("CONTRIBUTOR");

    constructor(address owner) {
        _setupRole(DEFAULT_ADMIN_ROLE, owner);
    }

    function addProjectManager(address account)
        public
        virtual
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        grantRole(ROLE_PROJECT_MANGER, account);
    }

    // @dev only owner or project managers themselves can remove their role
    function removeProjectManager(address account) public virtual {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, account) ||
                (msg.sender == account &&
                    hasRole(ROLE_PROJECT_MANGER, msg.sender)),
            "Only admin or the project manager can remove the role"
        );
        renounceRole(ROLE_PROJECT_MANGER, account);
    }

    function addContributor(address account)
        public
        virtual
        onlyRole(ROLE_PROJECT_MANGER)
    {
        grantRole(ROLE_CONTRIBUTOR, account);
    }

    // @dev only owner or project managers themselves can remove their role
    function removeContributor(address account) public virtual {
        require(
            hasRole(ROLE_PROJECT_MANGER, account) ||
                (msg.sender == account &&
                    hasRole(ROLE_CONTRIBUTOR, msg.sender)),
            "Only project managers or the controbutor can remove the role"
        );
        renounceRole(ROLE_PROJECT_MANGER, account);
    }
}
