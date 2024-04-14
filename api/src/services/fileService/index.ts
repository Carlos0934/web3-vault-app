import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export class FileService {
  private readonly s3 = new S3Client();
  constructor(
    private readonly config: {
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

        const key = crypto.randomUUID();

        await this.uploadToS3(buffer, key);
        resolve(key);
      };
      reader.onerror = reject;
    });
  }

  async getPresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    return url;
  }

  private async uploadToS3(buffer: ArrayBuffer, key: string) {
    const command = new PutObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
      Body: new Blob([buffer]),
    });
    await this.s3.send(command);
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucketName,
      Key: key,
    });
    await this.s3.send(command);
  }
}
