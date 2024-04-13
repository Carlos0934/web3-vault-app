import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export class FileService {
  private readonly s3 = new S3Client();
  constructor(
    private readonly encryptionKey: string,
    private readonly bucketName: string
  ) {}

  uploadFile(file: File): Promise<string> {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        const buffer = reader.result as ArrayBuffer;
        const encryptedBuffer = await this.encrypt(buffer);
        const key = crypto.randomUUID();

        await this.uploadToS3(encryptedBuffer, key);
        resolve(key);
      };
      reader.onerror = reject;
    });
  }

  async downloadFile(key: string): Promise<File> {
    const buffer = await this.downloadFromS3(key);
    const decryptedBuffer = await this.decrypt(buffer);
    return new File([decryptedBuffer], key);
  }

  private async uploadToS3(buffer: ArrayBuffer, key: string) {
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: new Blob([buffer]),
    });
    await this.s3.send(command);
  }

  private async downloadFromS3(key: string): Promise<ArrayBuffer> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
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
  private async encrypt(buffer: ArrayBuffer): Promise<ArrayBuffer> {
    const iv = crypto.getRandomValues(new Uint8Array(16));
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(this.encryptionKey),
      "AES-GCM",
      true,
      ["encrypt"]
    );
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      new Uint8Array(buffer)
    );
    return encryptedBuffer;
  }

  private async decrypt(buffer: ArrayBuffer): Promise<ArrayBuffer> {
    const iv = new Uint8Array(buffer.slice(0, 16));
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(this.encryptionKey),
      "AES-GCM",
      true,
      ["decrypt"]
    );
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      new Uint8Array(buffer.slice(16))
    );
    return decryptedBuffer;
  }
}
