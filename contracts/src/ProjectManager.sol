// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.14;

import {IProjectManager} from "interfaces/IProjectManager.sol";

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
    @notice Project management extension for KaliDAO

    A project manager is given permission to issue DAO tokens to contributors in accordance with
    the terms proposed to and approved by the DAO token holders:
    - office term: A manager cannot order token mints after the office term expires.
    - budget: A manager can order mint of DAO tokens up to a given budget.
    - goals: A manager is expected to act in accordance with the goals outlined in the DAO project proposal.

    A project's manager, budget, expiration and goals can be updated via DAO proposal.

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

    error NoBudgetLeft();
    error ProjectExpired();
    error Forbidden();

    /// -----------------------------------------------------------------------
    /// Project Management Storage
    /// -----------------------------------------------------------------------

    struct Project {
        unit id; // unique project identifier
        address manager; // manager assigned to this project
        uint256 budget; // maximum allowed tokens the manager is authorized to mint
        unit expiration; // expiration date of the project
        string goals; // structured text referencing key goals for the manager's mandate
    }

    // unique project id auto-increment
    // Starts at 100 leaving 0-99 as reserved for potential future special use cases.
    // 0 is reserved for a new project proposal that has not been processed and assigned an id yet.
    uint256 nextProjectId = 100;

    // DAO to projects mapping
    mapping(address => mapping(uint => Project[]) public management;

    // project to manager mapping
    // ?? mapping(uint => mapping(uint => address) public managerByProject;


    /// -----------------------------------------------------------------------
    /// Management Settings
    /// -----------------------------------------------------------------------

    /**
      @notice Activate DAO approved Project Proposals

      @param extensionData : Contains DAO approved projects[]; either new or existing project updates. New projects have id of 0.

     */
    function setExtension(bytes calldata extensionData) external {
        (Project[] projects) = abi.decode(
            extensionData,
            (Project[])
        );

        for (uint256 i; i < projects.length; ++i) {
            projectUpdate = projects[i];
            if (projectUpdate.id == 0) {
                // assign next id and auto increment id counter
                projectUpdate.id = nextProjectId++;
            }
            // msg.sender here is the DAO that controls this extension
            management[msg.sender][projects[i].id] = projects[i];
        }

        emit ExtensionSet(msg.sender, projects);
    }

    /// -----------------------------------------------------------------------
    /// Project Management Logic
    /// -----------------------------------------------------------------------

    /**
        @notice An authorized project manager calls this method to order DAO mint to contributors.

        @param dao - the dao that the project manager is authorized to manage.
        @param extensionData - contains a list of pairs: (project id, to contributor account, amount to mint).
     */
    function callExtension(address dao, bytes[] calldata extensionData)
        external
        nonReentrant
    {
        if (!management[dao][msg.sender]) revert Forbidden();

        for (uint256 i; i < extensionData.length; ++i) {
            (
                uint256 projectId,
                address toContributorAccount,
                uint256 mintAmount
            ) = abi.decode(extensionData[i], (address, uint256, bool));

            project = projects[projectId];

            if (!project) revert UknownProjectId(projectId);

            if (project.manager != msg.sender) revert Forbidden(projectId);

            if (project.budget < mintAmount) revert NoBudget(projectId);

            if (project.expiration < currentblock.timestamp) revert ProjectExpired();

            IProjectManager(dao).mintTokens(
                toContributorAccount,
                mintAmount
            );
        }

        emit ExtensionCalled(dao, msg.sender, extensionData);
    }
}
