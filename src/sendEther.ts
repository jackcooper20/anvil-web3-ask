import { Web3 } from "web3";
import { TransactionConfig } from "web3-core";

export async function sendEther(
  web3: Web3,
  txConfig: TransactionConfig
): Promise<string> {
  return await web3.eth.sendTransaction(txConfig);
}
