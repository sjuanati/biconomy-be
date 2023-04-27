import { ethers } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config();
import { ERC } from './utils/types';
import {
    getBalances,
    getSmartAccount,
} from './smartAccount';
import {
    NUM,
    ADDR,
} from './utils/constants';
import { sendGaslessTx } from './gaslessTransaction';
import { sendBatchTx } from './batchTransaction';
const HDWalletProvider = require("@truffle/hdwallet-provider");

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;
const dappAPIKey = process.env.DAPP_API_KEY;
const EOA1 = process.env.EOA1;
const EOA2 = process.env.EOA2;

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
                    const amount = ethers.BigNumber.from('1000000');
                    if (EOA1) {
                        await sendGaslessTx(
                            smartAccount,
                            EOA1,
                            amount,
                            ADDR.USDC,
                            '',
                            ERC.ERC20,
                        );
                    } else {
                        console.log('Destination address not defined in .env');
                    }

                    break;
                case 'send721':
                    // send a token via gasless txn
                    if (EOA1) {
                        await sendGaslessTx(
                            smartAccount,
                            EOA1,
                            NUM.ZERO,
                            ADDR.TOKEN721,
                            '0',
                            ERC.ERC721,
                        );
                    } else {
                        console.log('Destination address not defined in .env');
                    }
                    break;
                case 'sendBatch':
                    // send a batch of transactions
                    const amount2 = ethers.BigNumber.from('1000000');
                    if (EOA1 && EOA2) {
                        await sendBatchTx(
                            smartAccount,
                            amount2,
                            EOA1,
                            EOA2,
                        );
                    } else {
                        console.log('Destination addresses not defined in .env');
                    }
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
