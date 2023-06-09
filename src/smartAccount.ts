import { ADDR } from './utils/constants';
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
    const balanceParams: BalancesDto = {
        chainId: ChainId.GOERLI,
        eoaAddress: smartAccount.address,
        tokenAddresses: [
            ADDR.ETH,
            ADDR.USDC,
            ADDR.WETH,
        ],
    };
    const balFromSdk = await smartAccount.getAlltokenBalances(balanceParams);
    console.info("getAlltokenBalances", balFromSdk);
    // const usdBalFromSdk = await smartAccount.getTotalBalanceInUsd(balanceParams);
    // console.info("getTotalBalanceInUsd", usdBalFromSdk);
}
