import { ethers } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config();
import { ERC } from './utils/types';
import {
    getBalances,
    getSmartAccount,
} from './smartAccount';
import { NUM } from './utils/constants';
import { sendGaslessTx } from './gaslessTransaction';
const HDWalletProvider = require("@truffle/hdwallet-provider");

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;
const dappAPIKey = process.env.DAPP_API_KEY;

(async () => {
    try {
        const params: string[] = process.argv.slice(2);
        if (params.length > 0) {
            const provider = new HDWalletProvider(privateKey, rpcUrl);
            const walletProvider = new ethers.providers.Web3Provider(provider);
            const smartAccount = await getSmartAccount(
                walletProvider,
                dappAPIKey,
            );
            switch (params[0]) {
                case 'balance':
                    await getBalances(smartAccount);
                    break;
                case 'send20':
                    // send 1 USDC via gasless txn
                    const amount = ethers.BigNumber.from("1000000");
                    await sendGaslessTx(
                        smartAccount,
                        '0xFe5642377F6c036a40b5675F0Fa519B59569Bc26',
                        amount,
                        '',
                        ERC.ERC20,
                    );
                    break;
                case 'send721':
                    // send a token via gasless txn
                    await sendGaslessTx(
                        smartAccount,
                        '0xFe5642377F6c036a40b5675F0Fa519B59569Bc26',
                        NUM.ZERO,
                        '0',
                        ERC.ERC721,
                    );
                    break;
                default:
                    console.log('show params');
                    break;
            }
        }
        process.exit(0);
    } catch (err) {
        console.log(err);
    }
})();
