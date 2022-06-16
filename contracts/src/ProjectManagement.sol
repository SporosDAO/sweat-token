// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.14;

import {IProjectManagement} from "./interfaces/IProjectManagement.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "hardhat/console.sol";

/**
    @notice Project management extension for KaliDAO

    DAO token holders aprove and activate Projects that authorize a specific project manager to
    issue DAO tokens to contributors in accordance with
    the terms of the project:
    - budget: A manager can order mint of DAO tokens up to a given budget.
    - deadline: A manager cannot order token mints after the project deadline expires.
    - goals: A manager is expected to act in accordance with the goals outlined in the DAO project proposal.

    A project's manager, budget, deadline and goals can be updated via DAO proposal.

    A project has exactly one manager. A manager may be assigned to 0, 1 or multiple projects.

    Modeled after KaliShareManager.sol
    https://github.com/kalidao/kali-contracts/blob/main/contracts/extensions/manager/KaliShareManager.sol

    (c) 2022 sporosdao.eth

    @author ivelin.eth

 */
contract ProjectManagement is ReentrancyGuard {
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

        console.log("(EVM)---->: setExtension called");

        ((uint256, address, address , uint256, uint256, string)[] memory projectUpdates) = abi.decode(
            extensionData,
            ((uint256, address, address, uint256, uint256, string)[])
        );

        for (uint256 i; i < projectUpdates.length; ++i) {
            Project memory projectUpdate = projects[i];
            if (projectUpdate.id == 0) {
                // id == 0 means new Project creation
                // assign next id and auto increment id counter
                projectUpdate.id = nextProjectId++;
                projectUpdate.dao = msg.sender;
                // manager address needs to be set
                if (projectUpdate.manager == address(0)) revert ProjectManagerRequired();
            } else {
                Project memory savedProject = projects[projectUpdate.id];
                // someone is trying to update a non-existent project
                if (savedProject.id == 0) revert ProjectUnknown();
                // someone is trying to update a project that belongs to a different DAO address
                // only the DAO that created a project can modify it
                if (projectUpdate.dao != msg.sender || savedProject.dao != msg.sender) revert Forbidden();
            }
            // if all safety checks passed, create/update project
            projects[projectUpdate.id] = projectUpdate;
        }

        emit ExtensionSet(msg.sender, projectUpdates);
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
            ) = abi.decode(extensionData[i], (uint256, address, uint256));

            Project memory project = projects[projectId];

            if (project.id == 0) revert ProjectUnknown();

            if (project.manager != msg.sender) revert Forbidden();

            if (project.budget < mintAmount) revert ProjectNotEnoughBudget();

            if (project.deadline < block.timestamp) revert ProjectExpired();

            IProjectManagement(dao).mintTokens(
                toContributorAccount,
                mintAmount
            );
        }

        emit ExtensionCalled(dao, msg.sender, extensionData);
    }
}
