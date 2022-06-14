// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.14;

import {IProjectManager} from "./interfaces/IProjectManager.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
    @notice Project management extension for KaliDAO

    A project manager is given permission to issue DAO tokens to contributors in accordance with
    the terms proposed to and approved by the DAO token holders:
    - office term: A manager cannot order token mints after the office term expires.
    - budget: A manager can order mint of DAO tokens up to a given budget.
    - goals: A manager is expected to act in accordance with the goals outlined in the DAO project proposal.

    A project's manager, budget, deadline and goals can be updated via DAO proposal.

    A project has exactly one manager. A manager may be assigned to 0, 1 or mutliple projects.

    Modeled after KaliShareManager.sol
    https://github.com/kalidao/kali-contracts/blob/main/contracts/extensions/manager/KaliShareManager.sol

    (c) 2022 SporosDAO.eth

    @author ivelin.eth

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

    error ProjectNotEnoughBudget();
    error ProjectExpired();
    error ProjectManagerRequired();
    error ProjectUnknown();
    error Forbidden();

    /// -----------------------------------------------------------------------
    /// Project Management Storage
    /// -----------------------------------------------------------------------

    struct Project {
        uint256 id; // unique project identifier
        address dao; // the address of the DAO that this project belongs to
        address manager; // manager assigned to this project
        uint256 budget; // maximum allowed tokens the manager is authorized to mint
        uint256 deadline; // deadline date of the project
        string goals; // structured text referencing key goals for the manager's mandate
    }

    // unique project id auto-increment
    // Starts at 100 leaving 0-99 as reserved for potential future special use cases.
    // 0 is reserved for a new project proposal that has not been processed and assigned an id yet.
    uint256 nextProjectId = 100;

    // project id -> Project mapping
    mapping(uint256 => Project) public projects;

    /// -----------------------------------------------------------------------
    /// Management Settings
    /// -----------------------------------------------------------------------

    /**
      @notice A DAO calls this method to activate an approved Project Proposal.

      @param extensionData : Contains DAO approved projects[]; either new or existing project updates. New projects have id of 0.
     */
    function setExtension(bytes calldata extensionData) external {
        (Project[] projects) = abi.decode(
            extensionData,
            (Project[])
        );

        for (uint256 i; i < projects.length; ++i) {
            Project projectUpdate = projects[i];
            if (projectUpdate.id == 0) {
                // id == 0 means new Project creation
                // assign next id and auto increment id counter
                projectUpdate.id = nextProjectId++;
                projectUpdate.dao = msg.sender;
                // manager cannot be noone
                if (!projectUpdate.manager) revert ProjectManagerRequired();
            } else {
                Project savedProject = projects[projectUpdate.id];
                // someone is trying to update a non-existant project
                if (!savedProject) revert ProjectUnknown();
                // someone is trying to update a project that belongs to a different DAO address
                // only the DAO that created a project can modify it
                if (projectUpdate.dao != msg.sender || savedProject.dao != msg.sender) revert Forbidden();
            }
            // if all safety checks passed, create/update project
            projects[projectUpdate.id] = projectUpdate;
        }

        emit ExtensionSet(msg.sender, projects);
    }

    /// -----------------------------------------------------------------------
    /// Project Management Logic
    /// -----------------------------------------------------------------------

    /**
        @notice An authorized project manager calls this method to order a DAO token mint to contributors.

        @param dao - the dao that the project manager is authorized to manage.
        @param extensionData - contains a list of tuples: (project id, recipient contributor account, amount to mint).
     */
    function callExtension(address dao, bytes[] calldata extensionData)
        external
        nonReentrant
    {
        for (uint256 i; i < extensionData.length; ++i) {
            (
                uint256 projectId,
                address toContributorAccount,
                uint256 mintAmount
            ) = abi.decode(extensionData[i], (address, uint256, bool));

            Project project = projects[projectId];

            if (!project) revert ProjectUnknown();

            if (project.manager != msg.sender) revert Forbidden(projectId);

            if (project.budget < mintAmount) revert ProjectNotEnoughBudget(projectId);

            if (project.deadline < block.timestamp) revert ProjectExpired();

            IProjectManager(dao).mintTokens(
                toContributorAccount,
                mintAmount
            );
        }

        emit ExtensionCalled(dao, msg.sender, extensionData);
    }
}
