import { ethers } from 'hardhat';
import { BigNumber } from 'ethers';

/**
 * Sends ETH from one address to another
 * @param from The sender's address
 * @param to The recipient's address
 * @param amount The amount of ETH to send (in wei)
 * @returns The transaction receipt
 */
export async function sendEther(
  from: string,
  to: string,
  amount: BigNumber | string | number
): Promise<ethers.providers.TransactionReceipt> {
  // Convert amount to BigNumber if it isn't already
  const value = BigNumber.from(amount);

  // Get the signer for the 'from' address
  const signers = await ethers.getSigners();
  const signer = signers.find(s => s.address.toLowerCase() === from.toLowerCase());

  if (!signer) {
    throw new Error(`No signer found for address: ${from}`);
  }

  // Validate 'to' address
  if (!ethers.utils.isAddress(to)) {
    throw new Error(`Invalid recipient address: ${to}`);
  }

  // Check if sender has sufficient balance
  const balance = await ethers.provider.getBalance(from);
  if (balance.lt(value)) {
    throw new Error(`Insufficient balance. Required: ${value.toString()}, Available: ${balance.toString()}`);
  }

  // Create and send the transaction
  const tx = await signer.sendTransaction({
    to,
    value,
  });

  // Wait for transaction to be mined and return the receipt
  return await tx.wait();
}

/**
 * Sends ETH from one address to another with custom gas settings
 * @param from The sender's address
 * @param to The recipient's address
 * @param amount The amount of ETH to send (in wei)
 * @param gasLimit Optional gas limit
 * @param gasPrice Optional gas price (in wei)
 * @returns The transaction receipt
 */
export async function sendEtherWithGas(
  from: string,
  to: string,
  amount: BigNumber | string | number,
  gasLimit?: number,
  gasPrice?: BigNumber | string | number
): Promise<ethers.providers.TransactionReceipt> {
  const value = BigNumber.from(amount);
  const signers = await ethers.getSigners();
  const signer = signers.find(s => s.address.toLowerCase() === from.toLowerCase());

  if (!signer) {
    throw new Error(`No signer found for address: ${from}`);
  }

  if (!ethers.utils.isAddress(to)) {
    throw new Error(`Invalid recipient address: ${to}`);
  }

  const balance = await ethers.provider.getBalance(from);
  if (balance.lt(value)) {
    throw new Error(`Insufficient balance. Required: ${value.toString()}, Available: ${balance.toString()}`);
  }

  const txParams: ethers.providers.TransactionRequest = {
    to,
    value,
  };

  if (gasLimit) {
    txParams.gasLimit = gasLimit;
  }

  if (gasPrice) {
    txParams.gasPrice = BigNumber.from(gasPrice);
  }

  const tx = await signer.sendTransaction(txParams);
  return await tx.wait();
}

/**
 * Sends ETH from one address to multiple recipients
 * @param from The sender's address
 * @param recipients Array of recipient addresses and amounts
 * @returns Array of transaction receipts
 */
export async function sendEtherToMany(
  from: string,
  recipients: Array<{ to: string; amount: BigNumber | string | number }>
): Promise<ethers.providers.TransactionReceipt[]> {
  const signers = await ethers.getSigners();
  const signer = signers.find(s => s.address.toLowerCase() === from.toLowerCase());

  if (!signer) {
    throw new Error(`No signer found for address: ${from}`);
  }

  // Calculate total amount needed
  const totalAmount = recipients.reduce(
    (sum, recipient) => sum.add(BigNumber.from(recipient.amount)),
    BigNumber.from(0)
  );

  // Check total balance
  const balance = await ethers.provider.getBalance(from);
  if (balance.lt(totalAmount)) {
    throw new Error(`Insufficient balance. Required: ${totalAmount.toString()}, Available: ${balance.toString()}`);
  }

  // Send transactions
  const receipts = await Promise.all(
    recipients.map(async ({ to, amount }) => {
      if (!ethers.utils.isAddress(to)) {
        throw new Error(`Invalid recipient address: ${to}`);
      }

      const tx = await signer.sendTransaction({
        to,
        value: BigNumber.from(amount),
      });

      return await tx.wait();
    })
  );

  return receipts;
}
