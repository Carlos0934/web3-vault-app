import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Upload } from "@aws-sdk/lib-storage";

export class FileService {
  private readonly s3;
  constructor(
    private readonly config: {
      region: string;
      credentials: {
        accessKeyId: string;
        secretAccessKey: string;
      };
      bucket: string;
    }
  ) {
    this.s3 = new S3Client({
      region: config.region,
      credentials: {
        accessKeyId: config.credentials.accessKeyId,
        secretAccessKey: config.credentials.secretAccessKey,
      },
    });
  }

  async uploadFile(file: File): Promise<string> {
    const key = crypto.randomUUID();

    const upload = new Upload({
      client: this.s3,
      params: {
        Bucket: this.config.bucket,
        Key: key,
        Body: file.stream(),
      },
      partSize: 5 * 1024 * 1024, // 5 MB
      queueSize: 4, // 4 parallel uploads
    });

    await upload.done();

    return key;
  }

  async getPresignedUrl(key: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });

    const url = await getSignedUrl(this.s3, command, { expiresIn: 3600 });
    return url;
  }

  async deleteFile(key: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.config.bucket,
      Key: key,
    });
    await this.s3.send(command);
  }
}
