
import { ChainId } from '@biconomy/core-types';
import SmartAccount from '@biconomy/smart-account';
import { BalancesDto } from '@biconomy/node-client';


export const getSmartAccount = async (
    walletProvider: any,
    dappAPIKey: any,
): Promise<any> => {
    // get EOA address from wallet provider
    const eoa = await walletProvider.getSigner().getAddress();
    console.log(`EOA address: ${eoa}`);
    // set options for SmartAccount object creation
    const options = {
        activeNetworkId: ChainId.GOERLI,
        supportedNetworksIds: [
            ChainId.GOERLI,
        ],
        networkConfig: [
            {
                chainId: ChainId.GOERLI,
                dappAPIKey: dappAPIKey,
                // providerUrl: rpcUrl,
            },
        ]
    };
    // get SmartAccount data from wallet provider
    const wallet = new SmartAccount(walletProvider, options);
    const smartAccount = await wallet.init();
    const state = await smartAccount.getSmartAccountState();
    console.log(`SmartAccount address: ${state.address}`);
    console.dir(state, { depth: null });
    return smartAccount;
}

export const getBalances = async (smartAccount: any) => {
    const balanceParams: BalancesDto =
    {
        chainId: ChainId.GOERLI,
        eoaAddress: smartAccount.address,
        // If empty string you receive balances of all tokens watched by Indexer
        // you can only whitelist token addresses that are listed in token respostory
        // specified above ^
        tokenAddresses: [
            '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // ETH
            '0x07865c6E87B9F70255377e024ace6630C1Eaa37F', // USDC
        ],
    };

    const balFromSdk = await smartAccount.getAlltokenBalances(balanceParams);
    console.info("getAlltokenBalances", balFromSdk);

    const usdBalFromSdk = await smartAccount.getTotalBalanceInUsd(balanceParams);
    console.info("getTotalBalanceInUsd", usdBalFromSdk);
}
