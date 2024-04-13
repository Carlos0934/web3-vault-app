import { Web3 } from "web3";
import { secrets } from "./secrets";
import { fileMetadataRegistryAbi } from "./fileMetadataRegistryAbi";

const provider = new Web3.providers.HttpProvider(secrets.rpcProviderUrl!);
const web3 = new Web3(provider);

const account = web3.eth.accountProvider?.privateKeyToAccount(
  secrets.accountPrivateKey
);

web3.eth.defaultAccount = account?.address;

const fileMetadataRegistryContract = new web3.eth.Contract(
  fileMetadataRegistryAbi,
  secrets.fileMetadataRegistryContractAddress
);

export { web3, fileMetadataRegistryContract };
