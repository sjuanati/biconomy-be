
import { ChainId } from '@biconomy/core-types';
import SmartAccount from '@biconomy/smart-account';
import { BalancesDto } from '@biconomy/node-client';


export const getSmartAccount = async (walletProvider: any): Promise<any> => {

    // get EOA address from wallet provider
    const eoa = await walletProvider.getSigner().getAddress();
    console.log(`EOA address: ${eoa}`);

    // get SmartAccount address from wallet provider
    const wallet = new SmartAccount(walletProvider, {
        activeNetworkId: ChainId.GOERLI,
        supportedNetworksIds: [ChainId.GOERLI, ChainId.POLYGON_MAINNET, ChainId.POLYGON_MUMBAI],
        networkConfig: [
            {
                chainId: ChainId.POLYGON_MUMBAI,
                // Dapp API Key you will get from new Biconomy dashboard that will be live soon
                // Meanwhile you can use the test dapp api key mentioned above
                dappAPIKey: "<DAPP_API_KEY>",
                providerUrl: "<YOUR_PROVIDER_URL>"
            },
            {
                chainId: ChainId.POLYGON_MAINNET,
                // Dapp API Key you will get from new Biconomy dashboard that will be live soon
                // Meanwhile you can use the test dapp api key mentioned above
                dappAPIKey: "<DAPP_API_KEY>",
                providerUrl: "<YOUR_PROVIDER_URL>"
            }
        ]
    });
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
