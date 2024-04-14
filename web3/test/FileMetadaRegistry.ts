import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre from "hardhat";
import * as ethers from "ethers";

describe("FileMetadataRegistry", function () {
  async function deployFileMetadataRegistryFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const FileMetadataRegistry = await hre.ethers.getContractFactory(
      "FileMetadataRegistry"
    );
    const fileMetadataRegistry = await FileMetadataRegistry.deploy();

    return { fileMetadataRegistry, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { fileMetadataRegistry, owner } = await loadFixture(
        deployFileMetadataRegistryFixture
      );

      expect(await fileMetadataRegistry.owner()).to.equal(owner.address);
    });
  });

  describe("register", function () {
    it("Should set the right metadata", async function () {
      const { fileMetadataRegistry, owner } = await loadFixture(
        deployFileMetadataRegistryFixture
      );

      const fileChecksum = "0x1234567890abcdefffff";
      const fileName = "file.txt";
      const userId = ethers.encodeBytes32String("0x456");
      const size = 100;
      const key = "storageKey";

      const tx = await fileMetadataRegistry
        .connect(owner)
        .registerFile(key, fileChecksum, fileName, size, userId);
      await tx.wait();
    });
  });

  describe("getFilesByUser", function () {
    it("Should return the right metadata", async function () {
      const { fileMetadataRegistry, owner } = await loadFixture(
        deployFileMetadataRegistryFixture
      );

      const fileChecksum = "0x1234567890abcdefffff";
      const fileName = "file.txt";
      const userId = ethers.encodeBytes32String("0x456");
      const size = 100;
      const key = "storageKey";

      await fileMetadataRegistry
        .connect(owner)
        .registerFile(key, fileChecksum, fileName, size, userId);

      const metadata = await fileMetadataRegistry.getFilesByUser(userId);
      expect(metadata.length).to.equal(1);
      expect(metadata[0].checksum).to.equal(fileChecksum);
    });
  });

  describe("deleteUserFileAt", function () {
    it("Should delete the file at the right index", async function () {
      const { fileMetadataRegistry, owner } = await loadFixture(
        deployFileMetadataRegistryFixture
      );

      const fileChecksum = "0x1234567890abcdefffff";
      const fileName = "file.txt";
      const userId = ethers.encodeBytes32String("0x456");
      const size = 100;
      const key = "storageKey";

      await fileMetadataRegistry
        .connect(owner)
        .registerFile(key, fileChecksum, fileName, size, userId);

      await fileMetadataRegistry.connect(owner).deleteUserFileAt(userId, 0);

      const metadata = await fileMetadataRegistry.getFilesByUser(userId);
      expect(metadata.length).to.equal(0);
    });
  });

  describe("deleteAllUserFiles", function () {
    it("Should delete the file", async function () {
      const { fileMetadataRegistry, owner } = await loadFixture(
        deployFileMetadataRegistryFixture
      );

      const fileChecksum = "0x1234567890abcdefffff";
      const fileName = "file.txt";
      const userId = ethers.encodeBytes32String("0x456");
      const size = 100;
      const key = "storageKey";

      await fileMetadataRegistry
        .connect(owner)
        .registerFile(key, fileChecksum, fileName, size, userId);

      await fileMetadataRegistry.connect(owner).deleteAllUserFiles(userId);

      const metadata = await fileMetadataRegistry.getFilesByUser(userId);
      expect(metadata.length).to.equal(0);
    });
  });
});
