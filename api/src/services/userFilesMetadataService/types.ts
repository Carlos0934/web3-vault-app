export type RegisterFileMetadataInput = {
  userId: string;
  key: string;
  checksum: Uint8Array;
  file: {
    name: string;
    size: number;
  };
};
