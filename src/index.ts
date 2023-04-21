import { ethers } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config();
import {
    getBalances,
    getSmartAccount,
} from './smartAccount';
const HDWalletProvider = require("@truffle/hdwallet-provider");

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;

(async () => {
    try {
        const provider = new HDWalletProvider(privateKey, rpcUrl);
        const walletProvider = new ethers.providers.Web3Provider(provider);
        console.log('before')
        const smartAccount = await getSmartAccount(walletProvider);
        await getBalances(smartAccount);
        process.exit(0);
    } catch (err) {
        console.log(err);
    }
})();
