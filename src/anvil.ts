import { Web3, Contract, BlockNumber, TransactionConfig } from 'web3';
import { Method } from 'web3-core-method';
import { provider } from 'web3-core';
import { AbiInput } from 'web3-utils';

// Types
type ValidAddress = string;
type ValidBytes = string;
type Wei = string | number;

interface Forking {
    jsonRpcUrl?: string;
    blockNumber?: number;
}

// RPC Methods enum
enum AnvilRPC {
    anvil_impersonateAccount = "anvil_impersonateAccount",
    anvil_stopImpersonatingAccount = "anvil_stopImpersonatingAccount",
    anvil_autoImpersonateAccount = "anvil_autoImpersonateAccount",
    anvil_getAutomine = "anvil_getAutomine",
    evm_setAutomine = "evm_setAutomine",
    anvil_mine = "anvil_mine",
    evm_setIntervalMining = "evm_setIntervalMining",
    anvil_dropTransaction = "anvil_dropTransaction",
    anvil_reset = "anvil_reset",
    anvil_setChainId = "anvil_setChainId",
    anvil_setBalance = "anvil_setBalance",
    anvil_setCode = "anvil_setCode",
    anvil_setNonce = "anvil_setNonce",
    anvil_setStorageAt = "anvil_setStorageAt",
    evm_setNextBlockTimestamp = "evm_setNextBlockTimestamp"
}

export class Anvil {
    private web3: Web3;

    constructor(web3: Web3) {
        this.web3 = web3;
    }

    public async impersonateAccount(account: ValidAddress): Promise<void> {
        await this.sendAnvilMethod(AnvilRPC.anvil_impersonateAccount, [account]);
    }

    public async stopImpersonatingAccount(account: ValidAddress): Promise<void> {
        await this.sendAnvilMethod(AnvilRPC.anvil_stopImpersonatingAccount, [account]);
    }

    public async autoImpersonateAccount(enabled: boolean): Promise<void> {
        await this.sendAnvilMethod(AnvilRPC.anvil_autoImpersonateAccount, [enabled]);
    }

    public async getAutoMine(): Promise<boolean> {
        return await this.sendAnvilMethod(AnvilRPC.anvil_getAutomine, []);
    }

    public async setAutoMine(enableAutomine: boolean): Promise<void> {
        await this.sendAnvilMethod(AnvilRPC.evm_setAutomine, [enableAutomine]);
    }

    public async mine(numBlocks?: number, interval?: number): Promise<void> {
        await this.sendAnvilMethod(AnvilRPC.anvil_mine, [numBlocks, interval]);
    }

    public async setIntervalMining(secs: number): Promise<void> {
        await this.sendAnvilMethod(AnvilRPC.evm_setIntervalMining, [secs]);
    }

    public async dropTransaction(txHash: ValidBytes): Promise<ValidBytes | null> {
        return await this.sendAnvilMethod(AnvilRPC.anvil_dropTransaction, [txHash]);
    }

    public async reset(forking?: Forking): Promise<void> {
        await this.sendAnvilMethod(AnvilRPC.anvil_reset, [forking]);
    }

    public async setChainId(chainId: number): Promise<void> {
        await this.sendAnvilMethod(AnvilRPC.anvil_setChainId, [chainId]);
    }

    public async setBalance(account: ValidAddress, balance: Wei): Promise<void> {
        await this.sendAnvilMethod(AnvilRPC.anvil_setBalance, [account, balance]);
    }

    public async setCode(address: ValidAddress, code: ValidBytes): Promise<void> {
        await this.sendAnvilMethod(AnvilRPC.anvil_setCode, [address, code]);
    }

    public async setNonce(address: ValidAddress, nonce: number): Promise<void> {
        await this.sendAnvilMethod(AnvilRPC.anvil_setNonce, [address, nonce]);
    }

    public async setStorageAt(
        address: ValidAddress, 
        slot: number, 
        val: ValidBytes
    ): Promise<boolean> {
        return await this.sendAnvilMethod(
            AnvilRPC.anvil_setStorageAt, 
            [address, slot, val]
        );
    }

    public async setNextBlockTimestamp(timestamp: number): Promise<void> {
        await this.sendAnvilMethod(
            AnvilRPC.evm_setNextBlockTimestamp, 
            [timestamp]
        );
    }

    private async sendAnvilMethod<T>(
        method: AnvilRPC, 
        params: any[]
    ): Promise<T> {
        return new Promise((resolve, reject) => {
            this.web3.currentProvider?.send?.(
                {
                    jsonrpc: '2.0',
                    method,
                    params,
                    id: Date.now(),
                },
                (error, response) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(response.result);
                    }
                }
            );
        });
    }
}

// Extension for Web3
declare module 'web3' {
    interface Web3 {
        anvil: Anvil;
    }
}

// Attach Anvil module to Web3
export function attachAnvil(web3: Web3): void {
    web3.anvil = new Anvil(web3);
} 