function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is required`);
  }
  return value;
}

export const secrets = {
  jwtSecret: getEnv("JWT_SECRET"),
  encryptionKey: getEnv("ENCRYPTION_KEY"),
  awsRegion: getEnv("AWS_REGION"),
  iotaNodes: getEnv("IOTA_NODES").split(","),
};
