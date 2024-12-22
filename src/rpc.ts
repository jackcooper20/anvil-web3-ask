type Formatter<T, R = any> = (value: T) => R;
type AnyFunction = (...args: any[]) => any;
type OptionalValue<T, R = any> = (
  formatter: Formatter<T, R>,
  value: T
) => R | undefined;

function buffer<T>(arg: T): T {
  return arg;
}

function noArgs(): any[] {
  return [];
}

function noExpectedReturn(...args: any[]): void {
  return;
}

const optionalValue: OptionalValue<any> = (formatter, value) => {
  if (value !== undefined && value !== null) {
    return formatter(value);
  }
};

export class RPCEndpoint {
  constructor(public readonly method: string) {}
}

export class AnvilRPC {
  // Standard Methods
  anvil_impersonateAccount = new RPCEndpoint("anvil_impersonateAccount");
  anvil_stopImpersonatingAccount = new RPCEndpoint(
    "anvil_stopImpersonatingAccount"
  );
  anvil_autoImpersonateAccount = new RPCEndpoint(
    "anvil_autoImpersonateAccount"
  );
  anvil_getAutomine = new RPCEndpoint("anvil_getAutomine");
  anvil_mine = new RPCEndpoint("anvil_mine");
  anvil_dropTransaction = new RPCEndpoint("anvil_dropTransaction");
  anvil_reset = new RPCEndpoint("anvil_reset");
  anvil_setRpcUrl = new RPCEndpoint("anvil_setRpcUrl");
  anvil_setBalance = new RPCEndpoint("anvil_setBalance");
  anvil_setCode = new RPCEndpoint("anvil_setCode");
  anvil_setNonce = new RPCEndpoint("anvil_setNonce");
  anvil_setStorageAt = new RPCEndpoint("anvil_setStorageAt");
  anvil_setCoinbase = new RPCEndpoint("anvil_setCoinbase");
  anvil_setLoggingEnabled = new RPCEndpoint("anvil_setLoggingEnabled");
  anvil_setMinGasPrice = new RPCEndpoint("anvil_setMinGasPrice");
  anvil_setNextBlockBaseFeePerGas = new RPCEndpoint(
    "anvil_setNextBlockBaseFeePerGas"
  );
  anvil_setChainId = new RPCEndpoint("anvil_setChainId");
  anvil_dumpState = new RPCEndpoint("anvil_dumpState");
  anvil_loadState = new RPCEndpoint("anvil_loadState");
  anvil_nodeInfo = new RPCEndpoint("anvil_nodeInfo");

  // Special Methods
  evm_setAutomine = new RPCEndpoint("evm_setAutomine");
  evm_setIntervalMining = new RPCEndpoint("evm_setIntervalMining");
  evm_snapshot = new RPCEndpoint("evm_snapshot");
  evm_revert = new RPCEndpoint("evm_revert");
  evm_increaseTime = new RPCEndpoint("evm_increaseTime");
  evm_setNextBlockTimestamp = new RPCEndpoint("evm_setNextBlockTimestamp");
  anvil_setBlockTimestampInterval = new RPCEndpoint(
    "anvil_setBlockTimestampInterval"
  );
  evm_setBlockGasLimit = new RPCEndpoint("evm_setBlockGasLimit");
  anvil_removeBlockTimestampInterval = new RPCEndpoint(
    "anvil_removeBlockTimestampInterval"
  );
  evm_mine = new RPCEndpoint("evm_mine");
  anvil_enableTraces = new RPCEndpoint("anvil_enableTraces");
  eth_sendUnsignedTransaction = new RPCEndpoint("eth_sendUnsignedTransaction");

  // Methods based on Geth's documentation
  txpool_status = new RPCEndpoint("txpool_status");
  txpool_inspect = new RPCEndpoint("txpool_inspect");
  txpool_content = new RPCEndpoint("txpool_content");
}
