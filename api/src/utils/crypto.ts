export async function encrypt(
  buffer: ArrayBuffer,
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
  buffer: ArrayBuffer,
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

export async function arrayBufferToHex(buffer: ArrayBuffer): Promise<string> {
  const bytes = new Uint8Array(buffer);
  const hex = bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    ""
  );
  return "0x" + hex;
}

export function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

export function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
}
