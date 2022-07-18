// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.8.4;

import {ITrubuteProject} from "interfaces/ITrubuteProject.sol";

import {ReentrancyGuard} from "https://github.com/kalidao/kali-contracts/blob/main/contracts/utils/ReentrancyGuard.sol";

/// @notice Sporos DAO tribute project management extension
contract TributeProject is ITributeProject, ReentrancyGuard {
    /// -----------------------------------------------------------------------
    /// Events
    /// -----------------------------------------------------------------------

    event ExtensionSet(
        address indexed dao,
        address[] projects,
        bool[] approvals
    );
    event ExtensionCalled(
        address indexed dao,
        address indexed projects,
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

    mapping(address manager => projectIds[] public management;
    mapping(projectId => Project(address manager, uint budget, date expirationDate, string goals, bool active));

    /// -----------------------------------------------------------------------
    /// Project Management Settings
    /// -----------------------------------------------------------------------

    function setExtension(bytes calldata extensionData) external {
        (address[] memory managers, bool[] memory approvals) = abi.decode(
            extensionData,
            (address[], bool[])
        );

        if (managers.length != approvals.length) revert NoArrayParity();

        for (uint256 i; i < managers.length; ) {
            management[msg.sender][managers[i]] = approvals[i];
            // cannot realistically overflow
            unchecked {
                ++i;
            }
        }

        emit ExtensionSet(msg.sender, managers, approvals);
    }

    /// -----------------------------------------------------------------------
    /// Project Management Settings
    /// -----------------------------------------------------------------------

    function callExtension(address dao, bytes[] calldata extensionData)
        external
        nonReentrant
    {
        if (!management[dao][msg.sender]) revert Forbidden();

        for (uint256 i; i < extensionData.length; ) {
            (
                address account,
                uint256 amount,
            ) = abi.decode(extensionData[i], (address, uint256, bool));

            ITributeProject(dao).processTribute(
                account,
                amount
            );
            // cannot realistically overflow
            unchecked {
                ++i;
            }
        }

        emit ExtensionCalled(dao, msg.sender, extensionData);
    }
}