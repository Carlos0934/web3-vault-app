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

export function splitBytesByChunkStream(
  chunkSize: number
): TransformStream<Uint8Array, Uint8Array> {
  let buffer = new Uint8Array(chunkSize);
  let bufferIndex = 0;

  return new TransformStream({
    transform(chunk, controller) {
      while (chunk.length > 0) {
        const remainingSpace = buffer.length - bufferIndex;
        const bytesToCopy = Math.min(remainingSpace, chunk.length);

        buffer.set(chunk.slice(0, bytesToCopy), bufferIndex);
        bufferIndex += bytesToCopy;

        if (bufferIndex === buffer.length) {
          controller.enqueue(buffer);
          buffer = new Uint8Array(chunkSize);
          bufferIndex = 0;
        }

        chunk = chunk.slice(bytesToCopy);
      }
    },
    flush(controller) {
      if (bufferIndex > 0) {
        controller.enqueue(buffer.slice(0, bufferIndex));
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
