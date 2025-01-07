import Web3 from 'web3';
import { AnvilWeb3, AnvilInstance } from 'anvil-web3';

const main = async () => {
  try {
    const anvilInstance = new AnvilInstance();
    const web3 = new Web3(new Web3.providers.HttpProvider(anvilInstance.httpUrl)) as AnvilWeb3;

    web3.anvil.attach();

    const address = web3.utils.toChecksumAddress("0x1000000000000000000000000000000000000000");

    console.log("Starting operations for address:", address);

    const initialBalance = await web3.eth.getBalance(address);
    console.log("Balance before:", web3.utils.fromWei(initialBalance, 'ether'), "ETH");

    const newBalance = web3.utils.toWei('10', 'ether');
    await web3.anvil.setBalance(address, newBalance);

    const updatedBalance = await web3.eth.getBalance(address);
    console.log("Balance after:", web3.utils.fromWei(updatedBalance, 'ether'), "ETH");

    const newAccount = web3.eth.accounts.create();
    console.log("New account created:", newAccount.address);
    await web3.anvil.setBalance(newAccount.address, newBalance);

    const transferAmount = web3.utils.toWei('1', 'ether');
    const transaction = await web3.eth.sendTransaction({
      from: address,
      to: newAccount.address,
      value: transferAmount,
    });

    console.log(`Transferred ${web3.utils.fromWei(transferAmount, 'ether')} ETH from ${address} to ${newAccount.address}`);
    console.log("Transaction hash:", transaction.transactionHash);

    const senderBalance = await web3.eth.getBalance(address);
    const recipientBalance = await web3.eth.getBalance(newAccount.address);
    console.log("Sender balance after transfer:", web3.utils.fromWei(senderBalance, 'ether'), "ETH");
    console.log("Recipient balance after transfer:", web3.utils.fromWei(recipientBalance, 'ether'), "ETH");
  } catch (error) {
    console.error("An error occurred:", error);
  }
};

main();
