export const fileMetadataRegistryAbi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "checksum",
        type: "bytes32",
      },
      {
        indexed: true,
        internalType: "bytes32",
        name: "userId",
        type: "bytes32",
      },
      {
        indexed: false,
        internalType: "uint64",
        name: "timestamp",
        type: "uint64",
      },
    ],
    name: "Register",
    type: "event",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "name",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "checksum",
        type: "bytes32",
      },
      {
        internalType: "bytes32",
        name: "userId",
        type: "bytes32",
      },
    ],
    name: "register",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;
