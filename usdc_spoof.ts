import { ethers } from "ethers";
import { keccak256, defaultAbiCoder, hexlify, parseBytes32String } from "ethers/lib/utils";
import { JsonRpcProvider } from "@ethersproject/providers";

// Initialize the provider and signer
const provider = new ethers.providers.JsonRpcProvider("https://eth.llamarpc.com");
const privateKey = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("Hello world!"));
const signer = new ethers.Wallet(privateKey, provider);

console.log("Signer address:", signer.address);

// USDC contract details
const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const USDC_ABI_FRAGMENT = [
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

// USDC contract instance
const usdcContract = new ethers.Contract(USDC, USDC_ABI_FRAGMENT, provider);

(async () => {
  // Get balance before storage manipulation
  const balanceBefore = await usdcContract.balanceOf(signer.address);
  console.log("USDC Balance before:", balanceBefore.toString());

  // Calculate the storage slot
  const slotIndex = 9; // Initial slot index of balances mapping
  const storageSlot = keccak256(
    defaultAbiCoder.encode(["address", "uint256"], [signer.address, slotIndex])
  );

  // Manipulate storage using anvil RPC
  const newBalance = ethers.utils.hexZeroPad(ethers.BigNumber.from(10000).toHexString(), 32);

  const providerWithAnvil = new JsonRpcProvider("http://localhost:8545"); // Update with your local Anvil instance URL
  await providerWithAnvil.send("anvil_setStorageAt", [
    USDC,
    storageSlot,
    newBalance,
  ]);

  const balanceAfter = await usdcContract.balanceOf(signer.address);
  console.log("USDC Balance after:", balanceAfter.toString());
})();
