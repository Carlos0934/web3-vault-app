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

      const fileChecksum = ethers.encodeBytes32String("0x123");
      const userId = ethers.encodeBytes32String("0x456");
      const filename = ethers.encodeBytes32String("file.txt");

      const tx = await fileMetadataRegistry
        .connect(owner)
        .register(fileChecksum, userId, filename);

      await tx.wait();
      await expect(tx).to.emit(fileMetadataRegistry, "Register");
    });
  });
});
