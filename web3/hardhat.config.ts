import "dotenv/config";

import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.24",

  networks: {
    "testnet-shimmer": {
      url: "https://json-rpc.evm.testnet.shimmer.network",
      chainId: 1073,
      accounts: [process.env.PRIVATE_KEY!],
    },
  },
};

export default config;
