import { encrypt } from "./crypto";

export function encryptBytesStream(
  encryptionKey: string
): TransformStream<Uint8Array, Uint8Array> {
  return new TransformStream({
    async transform(chunk, controller) {
      controller.enqueue(await encrypt(chunk, encryptionKey));
    },
  });
}

export function splitBytesStream(
  chunkSize: number
): TransformStream<Uint8Array, Uint8Array> {
  return new TransformStream({
    transform(chunk, controller) {
      for (let i = 0; i < chunk.length; i += chunkSize) {
        controller.enqueue(chunk.slice(i, i + chunkSize));
      }
    },
  });
}

export function bytesToHexStream(): TransformStream<Uint8Array, string> {
  return new TransformStream({
    transform(chunk, controller) {
      const hex = chunk.reduce(
        (acc, byte) => acc + byte.toString(16).padStart(2, "0"),
        ""
      );

      controller.enqueue("0x" + hex);
    },
  });
}
