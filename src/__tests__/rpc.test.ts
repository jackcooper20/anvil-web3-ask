import { RPCEndpoint, AnvilRPC } from "../rpc";

describe("RPCEndpoint", () => {
  it("should create an endpoint with the correct method name", () => {
    const endpoint = new RPCEndpoint("test_method");
    expect(endpoint.method).toBe("test_method");
  });
});

describe("AnvilRPC", () => {
  let rpc: AnvilRPC;

  beforeEach(() => {
    rpc = new AnvilRPC();
  });

  describe("Standard Methods", () => {
    it("should have correct anvil_ method endpoints", () => {
      const expectedMethods = {
        anvil_impersonateAccount: "anvil_impersonateAccount",
        anvil_stopImpersonatingAccount: "anvil_stopImpersonatingAccount",
        anvil_autoImpersonateAccount: "anvil_autoImpersonateAccount",
        anvil_getAutomine: "anvil_getAutomine",
        anvil_mine: "anvil_mine",
        anvil_dropTransaction: "anvil_dropTransaction",
        anvil_reset: "anvil_reset",
        anvil_setRpcUrl: "anvil_setRpcUrl",
        anvil_setBalance: "anvil_setBalance",
        anvil_setCode: "anvil_setCode",
        anvil_setNonce: "anvil_setNonce",
        anvil_setStorageAt: "anvil_setStorageAt",
        anvil_setCoinbase: "anvil_setCoinbase",
        anvil_setLoggingEnabled: "anvil_setLoggingEnabled",
        anvil_setMinGasPrice: "anvil_setMinGasPrice",
        anvil_setNextBlockBaseFeePerGas: "anvil_setNextBlockBaseFeePerGas",
        anvil_setChainId: "anvil_setChainId",
        anvil_dumpState: "anvil_dumpState",
        anvil_loadState: "anvil_loadState",
        anvil_nodeInfo: "anvil_nodeInfo",
      };

      for (const [key, value] of Object.entries(expectedMethods)) {
        expect(rpc[key as keyof typeof expectedMethods]).toBeInstanceOf(
          RPCEndpoint
        );
        expect(rpc[key as keyof typeof expectedMethods].method).toBe(value);
      }
    });
  });

  describe("Special Methods", () => {
    it("should have correct evm_ method endpoints", () => {
      const expectedMethods = {
        evm_setAutomine: "evm_setAutomine",
        evm_setIntervalMining: "evm_setIntervalMining",
        evm_snapshot: "evm_snapshot",
        evm_revert: "evm_revert",
        evm_increaseTime: "evm_increaseTime",
        evm_setNextBlockTimestamp: "evm_setNextBlockTimestamp",
        evm_setBlockGasLimit: "evm_setBlockGasLimit",
        evm_mine: "evm_mine",
      };

      for (const [key, value] of Object.entries(expectedMethods)) {
        expect(rpc[key as keyof typeof expectedMethods]).toBeInstanceOf(
          RPCEndpoint
        );
        expect(rpc[key as keyof typeof expectedMethods].method).toBe(value);
      }
    });

    it("should have correct anvil-specific special method endpoints", () => {
      const expectedMethods = {
        anvil_setBlockTimestampInterval: "anvil_setBlockTimestampInterval",
        anvil_removeBlockTimestampInterval:
          "anvil_removeBlockTimestampInterval",
        anvil_enableTraces: "anvil_enableTraces",
      };

      for (const [key, value] of Object.entries(expectedMethods)) {
        expect(rpc[key as keyof typeof expectedMethods]).toBeInstanceOf(
          RPCEndpoint
        );
        expect(rpc[key as keyof typeof expectedMethods].method).toBe(value);
      }
    });
  });

  describe("Transaction Pool Methods", () => {
    it("should have correct txpool_ method endpoints", () => {
      const expectedMethods = {
        txpool_status: "txpool_status",
        txpool_inspect: "txpool_inspect",
        txpool_content: "txpool_content",
      };

      for (const [key, value] of Object.entries(expectedMethods)) {
        expect(rpc[key as keyof typeof expectedMethods]).toBeInstanceOf(
          RPCEndpoint
        );
        expect(rpc[key as keyof typeof expectedMethods].method).toBe(value);
      }
    });
  });

  it("should have eth_sendUnsignedTransaction endpoint", () => {
    expect(rpc.eth_sendUnsignedTransaction).toBeInstanceOf(RPCEndpoint);
    expect(rpc.eth_sendUnsignedTransaction.method).toBe(
      "eth_sendUnsignedTransaction"
    );
  });
});
