// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.14;

import {IProjectManager} from "interfaces/IProjectManager.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
    @notice project management extension for KaliDAO

    A project manager is given permission to issue DAO tokens to contributors in accordance with
    the terms proposed to and approved by the DAO token holders:
    - office term: A manager cannot order token mints after the office term expires.
    - budget: A manager can order mint of DAO tokens up to a given budget.
    - goals: A manager is expected to act in accordance with the goals outlined in the DAO project proposal.

    A project's manager, budget, expiration and goals can be updated via DAO proposal.

    A project has exactly one manager. A manager may be assigned to 0, 1 or mutliple projects.

    (c) 2022 SporosDAO.eth

 */
contract ProjectManager is ReentrancyGuard {
    /// -----------------------------------------------------------------------
    /// Events
    /// -----------------------------------------------------------------------

    event ExtensionSet(
        address indexed dao,
        Project[] projects
    );
    event ExtensionCalled(
        address indexed dao,
        address indexed project,
        bytes[] updates
    );

    /// -----------------------------------------------------------------------
    /// Errors
    /// -----------------------------------------------------------------------

    error NoArrayParity();
    error Forbidden();

    /// -----------------------------------------------------------------------
    /// Mgmt Storage
    /// -----------------------------------------------------------------------

    struct Project {
        unit id; // unique project identifier
        address manager; // manager assigned to this project
        uint256 budget; // maximum allowed tokens the manager is authorized to mint
        unit expiration; // expiration date of the project
        string goals; // structured text referencing key goals for the manager's mandate
    }

    // manager to projects mapping (1 -> [0..n])
    mapping(address => mapping(address => Project[]) public projectsByManager;

    // project to manager mapping (n -> 1)
    mapping(uint => mapping(uint => address) public managerByProject;


    /// -----------------------------------------------------------------------
    /// Management Settings
    /// -----------------------------------------------------------------------

    /**
      Set DAO approved project proposals
     */
    function setExtension(bytes calldata extensionData) external {
        (Project[] projects) = abi.decode(
            extensionData,
            (Project[])
        );

        for (uint256 i; i < projects.length; ) {
            management[msg.sender][managers[i]] = approvals[i];
            // cannot realistically overflow
            unchecked {
                ++i;
            }
        }

        emit ExtensionSet(msg.sender, projects);
    }

    /// -----------------------------------------------------------------------
    /// Mgmt Logic
    /// -----------------------------------------------------------------------

    function callExtension(address dao, bytes[] calldata extensionData)
        external
        nonReentrant
    {
        if (!management[dao][msg.sender]) revert Forbidden();

        if project budget used up revert NoBudgetLeft

        if project expired revert ProjectExpired

        if project manager != sender revert Forbidden

        for (uint256 i; i < extensionData.length; ) {
            (
                address account,
                uint256 amount,
                bool mint
            ) = abi.decode(extensionData[i], (address, uint256, bool));

            if (mint) {
                ISporosProjectManager(dao).mintShares(
                    account,
                    amount
                );
            } else {
                IKaliShareManager(dao).burnShares(
                    account,
                    amount
                );
            }
            // cannot realistically overflow
            unchecked {
                ++i;
            }
        }

        emit ExtensionCalled(dao, msg.sender, extensionData);
    }
}