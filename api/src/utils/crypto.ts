export async function encrypt(
  buffer: ArrayBuffer,
  encryptionKey: string
): Promise<ArrayBuffer> {
  const iv = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(encryptionKey),
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

export async function decrypt(
  buffer: ArrayBuffer,
  encryptionKey: string
): Promise<ArrayBuffer> {
  const iv = new Uint8Array(buffer.slice(0, 16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(encryptionKey),
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
