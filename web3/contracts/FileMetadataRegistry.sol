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

    function getFileByKey(
        bytes32 userId,
        string memory key
    ) public view returns (FileMetadata memory) {
        for (uint256 i = 0; i < userFiles[userId].length; i++) {
            if (
                keccak256(abi.encodePacked(userFiles[userId][i].key)) ==
                keccak256(abi.encodePacked(key))
            ) {
                return userFiles[userId][i];
            }
        }

        revert("File not found");
    }

    function deleteUserFileByKey(
        bytes32 userId,
        string memory key
    ) public onlyOwner {
        uint256 index = 0;

        for (uint256 i = 0; i < userFiles[userId].length; i++) {
            if (
                keccak256(abi.encodePacked(userFiles[userId][i].key)) ==
                keccak256(abi.encodePacked(key))
            ) {
                index = i;
                break;
            }
        }

        // Shift elements to the left to fill the gap at index
        for (uint256 i = index; i < userFiles[userId].length - 1; i++) {
            userFiles[userId][i] = userFiles[userId][i + 1];
        }

        userFiles[userId].pop();
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You aren't the owner");
        _;
    }
}
