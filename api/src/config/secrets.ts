if (!process.env.ACCOUNT_PRIVATE_KEY) {
  throw new Error("ACCOUNT_PRIVATE_KEY is required");
}

if (!process.env.FILE_METADATA_REGISTRY_ADDRESS) {
  throw new Error("FILE_METADATA_REGISTRY_ADDRESS is required");
}
if (!process.env.RPC_PROVIDER_URL) {
  throw new Error("RPC_PROVIDER_URL is required");
}

if (!process.env.ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is required");
}

export const secrets = {
  jwtSecret: process.env.JWT_SECRET || "secret",
  accountPrivateKey: process.env.ACCOUNT_PRIVATE_KEY,
  fileMetadataRegistryContractAddress:
    process.env.FILE_METADATA_REGISTRY_ADDRESS,
  rpcProviderUrl: process.env.RPC_PROVIDER_URL,
  encryptionKey: process.env.ENCRYPTION_KEY,
};
