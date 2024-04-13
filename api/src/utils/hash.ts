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
