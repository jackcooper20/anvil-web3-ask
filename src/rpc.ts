// RPC Method definitions
export enum AnvilRPC {
  // Account management
  anvil_impersonateAccount = "anvil_impersonateAccount",
  anvil_stopImpersonatingAccount = "anvil_stopImpersonatingAccount",
  anvil_autoImpersonateAccount = "anvil_autoImpersonateAccount",
  
  // Mining control
  anvil_getAutomine = "anvil_getAutomine",
  evm_setAutomine = "evm_setAutomine",
  anvil_mine = "anvil_mine",
  evm_setIntervalMining = "evm_setIntervalMining",
  
  // Transaction management
  anvil_dropTransaction = "anvil_dropTransaction",
  
  // Chain management
  anvil_reset = "anvil_reset",
  anvil_setChainId = "anvil_setChainId",
  
  // State management
  anvil_setBalance = "anvil_setBalance",
  anvil_setCode = "anvil_setCode",
  anvil_setNonce = "anvil_setNonce",
  anvil_setStorageAt = "anvil_setStorageAt",
  
  // Block management
  evm_setNextBlockTimestamp = "evm_setNextBlockTimestamp",
  
  // Additional useful methods
  evm_snapshot = "evm_snapshot",
  evm_revert = "evm_revert",
  evm_increaseTime = "evm_increaseTime",
  anvil_dumpState = "anvil_dumpState",
  anvil_loadState = "anvil_loadState"
}

export const RPC_ERRORS = {
  INVALID_PARAMS: -32602,
  METHOD_NOT_FOUND: -32601,
  INTERNAL_ERROR: -32603,
  INVALID_REQUEST: -32600,
  PARSE_ERROR: -32700
} as const;
