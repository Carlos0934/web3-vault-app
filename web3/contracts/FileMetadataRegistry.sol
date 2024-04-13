// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FileMetadataRegistry {
    address public owner;

    struct FileMetadata {
        bytes32 key;
        string checksum;
        string name;
        uint256 size;
        bytes32 userId;
        uint256 timestamp;
    }

    mapping(bytes32 => FileMetadata[]) public userFiles;

    constructor() {
        owner = msg.sender;
    }

    function registerFile(
        bytes32 key,
        string memory checksum,
        string memory name,
        uint256 size,
        bytes32 userId
    ) public {
        FileMetadata memory metadata = FileMetadata(
            key,
            checksum,
            name,
            size,
            userId,
            block.timestamp
        );
        userFiles[userId].push(metadata);
    }

    function getFilesByUser(
        bytes32 userId
    ) public view returns (FileMetadata[] memory) {
        return userFiles[userId];
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You aren't the owner");
        _;
    }
}
