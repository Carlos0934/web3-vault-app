import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

import { decrypt, encrypt } from "../../utils/crypto";
export class FileService {
  private readonly s3 = new S3Client();
  constructor(
    private readonly config: {
      encryptionKey: string;
      region: string;
      credentials: {
        accessKeyId: string;
        secretAccessKey: string;
      };
      bucketName: string;
    }
  ) {}

  uploadFile(file: File): Promise<string> {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const buffer = reader.result as ArrayBuffer;
        const encryptedBuffer = await encrypt(
          buffer,
          this.config.encryptionKey
        );
        const key = crypto.randomUUID();

        await this.uploadToS3(encryptedBuffer, key);
        resolve(key);
      };
      reader.onerror = reject;
    });
  }

  async downloadFile(key: string): Promise<File> {
    const buffer = await this.downloadFromS3(key);
    const decryptedBuffer = await decrypt(buffer, this.config.encryptionKey);
    return new File([decryptedBuffer], key);
  }

  private async uploadToS3(buffer: ArrayBuffer, key: string) {
    const command = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      Body: new Blob([buffer]),
    });
    await this.s3.send(command);
  }

  private async downloadFromS3(key: string): Promise<ArrayBuffer> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    });
    const response = await this.s3.send(command);
    const reader = response.Body?.transformToWebStream().getReader();
    const chunks: Uint8Array[] = [];
    if (!reader) {
      throw new Error("Failed to download file");
    }
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      chunks.push(value);
    }
    return new Blob(chunks).arrayBuffer();
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    });
    await this.s3.send(command);
  }
}
