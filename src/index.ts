import { ethers } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config();
import {
    getBalances,
    getSmartAccount,
} from './smartAccount';
import { sendGaslessTx } from './gaslessTransaction';
const HDWalletProvider = require("@truffle/hdwallet-provider");

const privateKey = process.env.PRIVATE_KEY;
const rpcUrl = process.env.RPC_URL;
const dappAPIKey = process.env.DAPP_API_KEY;

(async () => {
    try {
        const provider = new HDWalletProvider(privateKey, rpcUrl);
        const walletProvider = new ethers.providers.Web3Provider(provider);
        const smartAccount = await getSmartAccount(
            walletProvider,
            dappAPIKey,
        );
        await getBalances(smartAccount);
        await sendGaslessTx(
            smartAccount,
            '0xFe5642377F6c036a40b5675F0Fa519B59569Bc26',
            1000000,
        )
        process.exit(0);
    } catch (err) {
        console.log(err);
    }
})();
