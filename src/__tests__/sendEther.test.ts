import { Web3 } from "web3";
import { AnvilInstance } from "../wrapper";
import { attachAnvil } from "../anvil";
import { sendEther } from "../sendEther";

describe("sendEther", () => {
  let anvil: AnvilInstance;
  let web3: Web3;
  let accounts: string[];

  beforeAll(async () => {
    // Start Anvil instance with 10 accounts and 100 ETH each
    anvil = new AnvilInstance({
      accounts: 10,
      balance: "100000000000000000000" // 100 ETH
    });
    
    web3 = new Web3(anvil.httpUrl);
    attachAnvil(web3);
    
    accounts = await web3.eth.getAccounts();
  });

  afterAll(() => {
    anvil.kill();
  });

  it("should successfully send ether between accounts", async () => {
    const sender = accounts[0];
    const recipient = accounts[1];
    const amount = "1000000000000000000"; // 1 ETH

    const initialSenderBalance = await web3.eth.getBalance(sender);
    const initialRecipientBalance = await web3.eth.getBalance(recipient);

    await sendEther(web3, {
      from: sender,
      to: recipient,
      value: amount
    });

    const finalSenderBalance = await web3.eth.getBalance(sender);
    const finalRecipientBalance = await web3.eth.getBalance(recipient);

    // Recipient should have exactly 1 more ETH
    expect(BigInt(finalRecipientBalance) - BigInt(initialRecipientBalance))
      .toBe(BigInt(amount));

    // Sender should have 1 ETH less plus some gas
    expect(BigInt(initialSenderBalance) - BigInt(finalSenderBalance))
      .toBeGreaterThan(BigInt(amount));
  });

  it("should fail when sender has insufficient funds", async () => {
    const sender = accounts[0];
    const recipient = accounts[1];
    const tooMuchEther = "200000000000000000000"; // 200 ETH (more than account balance)

    await expect(
      sendEther(web3, {
        from: sender,
        to: recipient,
        value: tooMuchEther
      })
    ).rejects.toThrow(/insufficient funds/i);
  });

  it("should fail with invalid recipient address", async () => {
    const sender = accounts[0];
    const invalidRecipient = "0xinvalid";
    const amount = "1000000000000000000"; // 1 ETH

    await expect(
      sendEther(web3, {
        from: sender,
        to: invalidRecipient,
        value: amount
      })
    ).rejects.toThrow(/invalid address/i);
  });

  it("should handle zero value transfers", async () => {
    const sender = accounts[0];
    const recipient = accounts[1];
    const amount = "0";

    const initialRecipientBalance = await web3.eth.getBalance(recipient);

    await sendEther(web3, {
      from: sender,
      to: recipient,
      value: amount
    });

    const finalRecipientBalance = await web3.eth.getBalance(recipient);

    expect(finalRecipientBalance).toBe(initialRecipientBalance);
  });

  it("should respect custom gas settings", async () => {
    const sender = accounts[0];
    const recipient = accounts[1];
    const amount = "1000000000000000000"; // 1 ETH
    const customGas = "30000";

    await expect(
      sendEther(web3, {
        from: sender,
        to: recipient,
        value: amount,
        gas: customGas
      })
    ).resolves.not.toThrow();
  });

  it("should handle multiple consecutive transfers", async () => {
    const sender = accounts[0];
    const recipient = accounts[1];
    const amount = "1000000000000000000"; // 1 ETH

    const initialRecipientBalance = await web3.eth.getBalance(recipient);

    // Send 3 consecutive transfers
    await Promise.all([
      sendEther(web3, { from: sender, to: recipient, value: amount }),
      sendEther(web3, { from: sender, to: recipient, value: amount }),
      sendEther(web3, { from: sender, to: recipient, value: amount })
    ]);

    const finalRecipientBalance = await web3.eth.getBalance(recipient);

    // Recipient should have exactly 3 more ETH
    expect(BigInt(finalRecipientBalance) - BigInt(initialRecipientBalance))
      .toBe(BigInt(amount) * BigInt(3));
  });
}); 