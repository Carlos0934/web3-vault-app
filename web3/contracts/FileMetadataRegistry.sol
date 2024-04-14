// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract FileMetadataRegistry {
    address public immutable owner;

    struct FileMetadata {
        string key;
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
        string memory key,
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

    function deleteUserFileAt(bytes32 userId, uint256 index) public onlyOwner {
        require(index < userFiles[userId].length, "Index out of bounds");
        // Shift elements to the left to fill the gap at index
        for (uint256 i = index; i < userFiles[userId].length - 1; i++) {
            userFiles[userId][i] = userFiles[userId][i + 1];
        }

        userFiles[userId].pop();
    }

    function deleteAllUserFiles(bytes32 userId) public onlyOwner {
        delete userFiles[userId];
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You aren't the owner");
        _;
    }
}
