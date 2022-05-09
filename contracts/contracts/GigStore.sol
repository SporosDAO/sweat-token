//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "./GigContractRoles.sol";

abstract contract GigStore is EIP712, ERC1155, GigContractRoles {
    uint256 public constant GIGS = 0;
    uint256 public constant POW = 1;
    uint256 public constant DISPUTE = 2;

    event ProjectAdded(address indexed project, address indexed projectManager);
    event GigAdded(uint256 gig);

    constructor(
        string memory uri,
        string memory name,
        string memory version
    ) EIP712(name, version) ERC1155(uri) {}

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

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    enum GigStatus {
        Open,
        Offered,
        Assigned,
        Ongoing,
        InReview,
        Closed,
        Dispute,
        Completed,
        DeadlineExceeded
    }

    struct Gig {
        uint256 id;
        uint256 deadline;
        address contributor;
        GigStatus status;
    }

    enum ProjectStatus {
        Open,
        Ongoing,
        Closed,
        Completed,
        DeadlineExceeded
    }

    struct Project {
        address projectManager;
        ProjectStatus status;
        uint256 deadline;
        uint256[] gigs;
    }

    mapping(address => uint256) projectsMap;
    Project[] public projects;

    mapping(uint256 => bool) gigsMap;
    Gig[] public gigs;

    /**
        addProjects
        store prjects references
    */
    function addProjects(
        address[] memory projectManagers,
        address[] memory daoProjectContracts,
        uint256[] memory deadlines
    ) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(
            projectManagers.length == daoProjectContracts.length &&
                projectManagers.length == deadlines.length,
            "Arguments must have the same size"
        );

        for (uint256 i = 0; i < projectManagers.length; i++) {
            addProjectManager(projectManagers[i]);
            uint256[] memory projectGigs;
            Project memory project = Project({
                projectManager: projectManagers[i],
                status: ProjectStatus.Open,
                deadline: deadlines[i],
                gigs: projectGigs
            });

            uint256 plen = projects.length;
            projectsMap[daoProjectContracts[i]] = (plen == 0) ? 1 : plen;
            projects.push(project);
            emit ProjectAdded(daoProjectContracts[i], projectManagers[i]);
        }
    }

    function offerGig(
        address project,
        uint256 deadline,
        address contributor
    ) public onlyRole(ROLE_PROJECT_MANGER) returns (uint256) {
        uint256 pid = projectsMap[project];
        require(pid == 0, "Project not found");

        _mint(msg.sender, GIGS, 1, "");

        uint256 glen = gigs.length;
        Gig memory gig = Gig({
            id: glen == 0 ? 1 : glen,
            deadline: deadline,
            contributor: contributor,
            status: GigStatus.Offered
        });

        gigs.push(gig);
        projects[pid].gigs.push(gig.id);
        gigsMap[gig.id] = true;

        emit GigAdded(gig.id);
        return gig.id;
    }
}
