import { scrypt, timingSafeEqual, randomBytes } from "node:crypto";

export async function encrypt(
  buffer: Uint8Array,
  encryptionKey: string
): Promise<Uint8Array> {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(encryptionKey),
    "AES-GCM",
    false,
    ["encrypt"]
  );
  const encryptedBuffer = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: 128,
    },
    key,
    new Uint8Array(buffer)
  );

  return new Uint8Array([...iv, ...new Uint8Array(encryptedBuffer)]);
}

export async function decrypt(
  buffer: Uint8Array,
  encryptionKey: string
): Promise<Uint8Array> {
  const iv = new Uint8Array(buffer.slice(0, 16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(encryptionKey),
    "AES-GCM",
    false,
    ["decrypt"]
  );
  const decryptedBuffer = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv,
      tagLength: 128,
    },
    key,
    new Uint8Array(buffer.slice(16))
  );

  return new Uint8Array(decryptedBuffer);
}

export function stringToUint8Array(str: string): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

export async function getChecksum(file: File): Promise<Uint8Array> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const checksum = await crypto.subtle.digest("SHA-256", bytes);
  return new Uint8Array(checksum);
}

type HashFunction = "SHA-256" | "SHA-512";
export const hashHex = async (
  input: string,
  hashFunction: HashFunction
): Promise<string> => {
  const textEncoder = new TextEncoder();

  const encoded = textEncoder.encode(input);

  const hashBuffer = await crypto.subtle.digest(hashFunction, encoded);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hashHex = hashArray
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");

  return "0x" + hashHex;
};

export function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = randomBytes(16).toString("hex");
    scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      resolve(`${salt}:${derivedKey.toString("hex")}`);
    });
  });
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const [salt, key] = hash.split(":");
  const keyBuffer = Buffer.from(key, "hex");

  return new Promise((resolve, reject) => {
    scrypt(password, salt, 32, (err, derivedKey) => {
      if (err) reject(err);
      const derivedKeyBuffer = Buffer.from(derivedKey);
      resolve(timingSafeEqual(keyBuffer, derivedKeyBuffer));
    });
  });
}
