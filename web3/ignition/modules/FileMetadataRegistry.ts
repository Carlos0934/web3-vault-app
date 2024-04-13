import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const FileMetadataRegistryModule = buildModule(
  "FileMetadataRegistryModule",
  (m) => {
    const fileMetadataRegistry = m.contract("FileMetadataRegistry", []);

    return { fileMetadataRegistry };
  }
);

export default FileMetadataRegistryModule;
