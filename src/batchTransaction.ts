import {
    ethers,
    BigNumber,
} from "ethers";
import { ADDR } from './utils/constants';


export const sendBatchTx = async (
    smartAccount: any,
    amount: BigNumber,
) => {
    try {
        // create an array of txs 
        const txs = [];
        const receiver1 = '0x9B27d35D850372d1aAaB630164Ca06e084c5cA14';
        const receiver2 = '0xFe5642377F6c036a40b5675F0Fa519B59569Bc26';

        const erc20Interface = new ethers.utils.Interface([
            'function transfer(address _to, uint256 _value)'
        ]);

        // Encode two transfers
        const data1 = erc20Interface.encodeFunctionData(
            'transfer', [receiver1, amount]
        );
        const data2 = erc20Interface.encodeFunctionData(
            'transfer', [receiver2, amount]
        );

        const tx1 = {
            to: ADDR.USDC,
            data: data1,
        }
        const tx2 = {
            to: ADDR.USDC,
            data: data2,
        };
        txs.push(tx1);
        txs.push(tx2);

        // Fee Abstraction and Dispatching
        // 1. Gasless 
        const txResponse = await smartAccount.sendTransactionBatch({ transactions: txs });
        console.log('userOp Hash', txResponse);
        const txReciept = await txResponse.wait();
        console.log('Tx hash', txReciept.transactionHash);

    } catch (err) {
        console.log(err);
    }
}
