//SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.0;

// import "hardhat/console.sol";

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Project is ERC721URIStorage {
    string _tokenURI;

    using Counters for Counters.Counter;
    Counters.Counter private _projects;

    constructor(string memory __tokenURI) ERC721("SporosDAOProject", "SPRJ") {
        _tokenURI = __tokenURI;
    }

    function create(
        uint256 goals,
        uint256 budget,
        uint256 deadline
    ) public returns (uint256 projectId) {
        _projects.increment();

        uint256 newProjectId = _projects.current();
        _mint(msg.sender, newProjectId);
        _setTokenURI(newProjectId, _tokenURI);

        return newProjectId;
    }
}
