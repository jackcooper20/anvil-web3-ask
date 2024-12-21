import { AnvilInstance, AnvilWeb3 } from "anvil-web3";
import Web3 from "web3";
import { Account } from "web3-core";

(async () => {
    const anvilInstance = new AnvilInstance();
    const web3 = new AnvilWeb3(new Web3.providers.HttpProvider(anvilInstance.httpUrl));

    const signer: Account = web3.eth.accounts.privateKeyToAccount(
        web3.utils.keccak256("Hello world!") as string
    );

    console.log("Signer address:", signer.address);

    const oneEther = web3.utils.toWei("1", "ether");
    await web3.anvil.setBalance(signer.address, oneEther);

    const futureTimestamp = 4242424242;
    await web3.anvil.setNextBlockTimestamp(futureTimestamp);

    await web3.anvil.mine(1, null);

    const latestBlock = await web3.eth.getBlock("latest");
    if (!latestBlock.timestamp) {
        throw new Error("Block timestamp is undefined.");
    }

    console.assert(latestBlock.timestamp === futureTimestamp, "Block timestamp does not match.");
    console.log("Hardcoded Block timestamp:", latestBlock.timestamp);

    const balance = await web3.eth.getBalance(signer.address);
    console.log("Signer balance:", web3.utils.fromWei(balance, "ether"), "ETH");

    const tx = await web3.eth.sendTransaction({
        from: signer.address,
        to: "0x000000000000000000000000000000000000dead",
        value: web3.utils.toWei("0.1", "ether"),
        gas: 21000,
    });
    console.log("Transaction successful:", tx.transactionHash);

    throw new Error("End of snippet");
})();
