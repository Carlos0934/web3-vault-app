// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FileMetadataRegistry {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    event Register(
        bytes32 name,
        bytes32 indexed checksum,
        bytes32 indexed userId,
        uint64 timestamp
    );

    function register(
        bytes32 name,
        bytes32 checksum,
        bytes32 userId
    ) public onlyOwner {
        emit Register(name, checksum, userId, uint64(block.timestamp));
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You aren't the owner");
        _;
    }
}
