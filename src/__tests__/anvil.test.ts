import { Web3 } from 'web3';
import { Anvil, attachAnvil } from './Anvil';

describe('Anvil', () => {
    let mockWeb3;
    let mockProvider;
    let anvil;

    beforeEach(() => {
        mockProvider = {
            send: jest.fn((payload, callback) => {
                if (payload.method === 'anvil_getAutomine') {
                    callback(null, { result: true });
                } else {
                    callback(null, { result: payload.params[0] });
                }
            }),
        };

        mockWeb3 = new Web3();
        mockWeb3.currentProvider = mockProvider;

        attachAnvil(mockWeb3);
        anvil = mockWeb3.anvil;
    });

    test('impersonateAccount calls the correct RPC method', async () => {
        const account = '0x1234567890abcdef1234567890abcdef12345678';
        await anvil.impersonateAccount(account);

        expect(mockProvider.send).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'anvil_impersonateAccount', params: [account] }),
            expect.any(Function)
        );
    });

    test('stopImpersonatingAccount calls the correct RPC method', async () => {
        const account = '0x1234567890abcdef1234567890abcdef12345678';
        await anvil.stopImpersonatingAccount(account);

        expect(mockProvider.send).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'anvil_stopImpersonatingAccount', params: [account] }),
            expect.any(Function)
        );
    });

    test('autoImpersonateAccount calls the correct RPC method', async () => {
        const enabled = true;
        await anvil.autoImpersonateAccount(enabled);

        expect(mockProvider.send).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'anvil_autoImpersonateAccount', params: [enabled] }),
            expect.any(Function)
        );
    });

    test('getAutoMine returns the correct value', async () => {
        const result = await anvil.getAutoMine();
    
        expect(result).toBe(true);
        expect(mockProvider.send).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'anvil_getAutomine', params: [] }),
            expect.any(Function)
        );
    });
    
    test('setAutoMine calls the correct RPC method', async () => {
        const enableAutomine = false;
        await anvil.setAutoMine(enableAutomine);
    
        expect(mockProvider.send).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'evm_setAutomine', params: [enableAutomine] }),
            expect.any(Function)
        );
    });
    
    test('mine calls the correct RPC method', async () => {
        const numBlocks = 5;
        const interval = 10;
        await anvil.mine(numBlocks, interval);
    
        expect(mockProvider.send).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'anvil_mine', params: [numBlocks, interval] }),
            expect.any(Function)
        );
    });
    
    test('setIntervalMining calls the correct RPC method', async () => {
        const secs = 15;
        await anvil.setIntervalMining(secs);
    
        expect(mockProvider.send).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'evm_setIntervalMining', params: [secs] }),
            expect.any(Function)
        );
    });
    
    test('dropTransaction calls the correct RPC method and returns result', async () => {
        const txHash = '0xabcdef';
        const result = await anvil.dropTransaction(txHash);
    
        expect(result).toBe(txHash);
        expect(mockProvider.send).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'anvil_dropTransaction', params: [txHash] }),
            expect.any(Function)
        );
    });

    test('reset calls the correct RPC method', async () => {
        const forking = { jsonRpcUrl: 'http://localhost:8545', blockNumber: 12345 };
        await anvil.reset(forking);
    
        expect(mockProvider.send).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'anvil_reset', params: [forking] }),
            expect.any(Function)
        );
    });
    
    test('setChainId calls the correct RPC method', async () => {
        const chainId = 1337;
        await anvil.setChainId(chainId);
    
        expect(mockProvider.send).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'anvil_setChainId', params: [chainId] }),
            expect.any(Function)
        );
    });
    
    test('setBalance calls the correct RPC method', async () => {
        const account = '0x1234567890abcdef1234567890abcdef12345678';
        const balance = '1000000000000000000';
        await anvil.setBalance(account, balance);
    
        expect(mockProvider.send).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'anvil_setBalance', params: [account, balance] }),
            expect.any(Function)
        );
    });
    
    test('setCode calls the correct RPC method', async () => {
        const address = '0x1234567890abcdef1234567890abcdef12345678';
        const code = '0xabcdef';
        await anvil.setCode(address, code);
    
        expect(mockProvider.send).toHaveBeenCalledWith(
            expect.objectContaining({ method: 'anvil_setCode', params: [address, code] }),
            expect.any(Function)
        );
    });
});
