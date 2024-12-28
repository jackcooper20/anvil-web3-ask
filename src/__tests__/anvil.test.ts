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
});
