function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export const secrets = {
  jwtSecret: getEnv("JWT_SECRET"),
  accountPrivateKey: getEnv("ACCOUNT_PRIVATE_KEY"),
  fileMetadataRegistryContractAddress: getEnv("FILE_METADATA_REGISTRY_ADDRESS"),
  rpcProviderUrl: getEnv("RPC_PROVIDER_URL"),
  encryptionKey: getEnv("ENCRYPTION_KEY"),
  awsAccessKeyId: getEnv("AWS_ACCESS_KEY_ID"),
  awsSecretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY"),
  bucketName: getEnv("BUCKET_NAME"),
  awsRegion: getEnv("AWS_REGION"),
};
