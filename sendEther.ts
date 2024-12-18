import { AnvilInstance, AnvilWeb3 } from 'anvil-web3';
import { HttpProvider, Web3 } from 'web3';
import { LocalAccount } from 'eth-account';
import { Hex } from 'web3-utils';
import { Wei, Gwei } from 'web3/types';

const anvilInstance = new AnvilInstance();
const w3 = new AnvilWeb3(new HttpProvider(anvilInstance.httpUrl));

const signer: LocalAccount = w3.eth.accounts.privateKeyToAccount(w3.keccak('Hello world!'));

console.log("Signer address", signer.address);

w3.anvil.setBalance(signer.address, w3.utils.toWei('1', 'ether'));
console.log(`Balance set to 1 Ether for ${signer.address}`);

async function getBalance(address: string): Promise<string> {
  const balance = await w3.eth.getBalance(address);
  return w3.utils.fromWei(balance, 'ether');
}

getBalance(signer.address).then((balance) => {
  console.log(`Initial balance of signer: ${balance} Ether`);
});

const txn = {
  chainId: w3.eth.chainId,
  data: Hex('0x'),
  from: signer.address,
  gas: 21000,
  maxFeePerGas: 1 * 10**9,
  maxPriorityFeePerGas: 1 * 10**9,
  nonce: await w3.eth.getTransactionCount(signer.address),
  to: '0x0000000000000000000000000000000000000000',
  value: new Wei(50),
};

async function sendTransaction() {
  try {
    const signedTransaction = await signer.signTransaction(txn);
    const hash = await w3.eth.sendSignedTransaction(signedTransaction.rawTransaction);
    console.log(`Transaction hash: ${hash}`);
    
    const receipt = await w3.eth.getTransactionReceipt(hash);
    console.log("Transaction receipt:", receipt);

    getBalance(signer.address).then((balance) => {
      console.log(`Balance after transaction: ${balance} Ether`);
    });
  } catch (error) {
    console.error("Error sending transaction:", error);
  }
}

sendTransaction();

async function createNewAccountAndTransfer() {
  const newAccount = w3.eth.accounts.create();
  console.log("New account created:", newAccount.address);

  const transferTxn = {
    chainId: w3.eth.chainId,
    data: Hex('0x'),
    from: signer.address,
    to: newAccount.address,
    value: w3.utils.toWei('0.1', 'ether'),
    nonce: await w3.eth.getTransactionCount(signer.address),
  };

  try {
    const signedTransfer = await signer.signTransaction(transferTxn);
    const transferHash = await w3.eth.sendSignedTransaction(signedTransfer.rawTransaction);
    console.log(`Transfer transaction hash: ${transferHash}`);

    const transferReceipt = await w3.eth.getTransactionReceipt(transferHash);
    console.log("Transfer transaction receipt:", transferReceipt);

    getBalance(newAccount.address).then((balance) => {
      console.log(`Balance of new account: ${balance} Ether`);
    });
  } catch (error) {
    console.error("Error in transfer:", error);
  }
}

createNewAccountAndTransfer();
