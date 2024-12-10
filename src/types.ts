// Ethereum specific types
export type Address = string;
export type ChecksumAddress = string;
export type HexAddress = string;
export type BlockNumber = number;
export type Hash32 = string;
export type HexStr = string;
export type BlockIdentifier = string | number;

// Union types for validation
export type ValidAddress = Address | ChecksumAddress | HexAddress | string;
export type ValidBytes = HexStr | Uint8Array;

// Base configuration interface
export interface AnvilConfigBase {
    // Anvil Options
    accounts?: number;
    blockTime?: number;
    balance?: number;
    configOut?: string;
    derivationPath?: string;
    dumpState?: string;
    hardfork?: string;
    init?: string;
    ipc?: string;
    loadState?: string;
    mnemonic?: string;
    noMining?: boolean;
    order?: string;
    pruneHistory?: boolean | number;
    stateInterval?: number;
    silent?: boolean;
    state?: string;
    timestamp?: number;
    transactionBlockKeeper?: number;

    // Server Options
    allowOrigin?: string;
    noCors?: boolean;

    // Fork Config
    computeUnitsPerSecond?: number;
    forkUrl?: string;
    forkBlockNumber?: number;
    forkChainId?: string;
    forkRetryBackoff?: string;
    noRateLimit?: boolean;
    noStorageCaching?: boolean;
    retries?: number;
    timeout?: number;

    // Environment Config
    blockBaseFeePerGas?: number;
    chainId?: number;
    codeSizeLimit?: number;
    disableBlockGasLimit?: boolean;
    gasLimit?: number;
    gasPrice?: number;

    // EVM options
    autoImpersonate?: boolean;
    stepsTracing?: boolean;
}

// Extended config with optional host and port
export interface AnvilConfig extends AnvilConfigBase {
    host?: string;
    port?: string;
}

// Config instance with required host and port
export interface AnvilConfigInstance extends AnvilConfigBase {
    host: string;
    port: string;
}

// Forking configuration
export interface Forking {
    jsonRpcUrl?: string;
    blockNumber?: number;
}

// Type guards for type checking
export const isValidAddress = (value: any): value is ValidAddress => {
    return typeof value === 'string' && /^(0x)?[0-9a-fA-F]{40}$/.test(value);
};

export const isValidBytes = (value: any): value is ValidBytes => {
    return (
        (typeof value === 'string' && /^0x[0-9a-fA-F]*$/.test(value)) ||
        value instanceof Uint8Array
    );
}; 