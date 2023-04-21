import { ethers } from "ethers";

const erc20Interface = new ethers.utils.Interface([
    'function transfer(address _to, uint256 _value)'
])

export const sendGaslessTx = async (
    smartAccount: any,
    recipientAddress: string,
    amount: number,
) => {
    try {
        // Encode an ERC-20 token transfer to the recipient of the specified amount
        const data = erc20Interface.encodeFunctionData(
            'transfer', [recipientAddress, amount]
        )

        const tx1 = {
            to: '0x07865c6E87B9F70255377e024ace6630C1Eaa37F', //usdcAddress,
            data,
        }

        // Transaction subscription
        smartAccount.on('txHashGenerated', (response: any) => {
            console.log('txHashGenerated event received via emitter', response);
            console.log(`Transaction sent: ${response.hash}`);
        });
        smartAccount.on('txMined', (response: any) => {
            console.log('txMined event received via emitter', response);
            console.log(`Transaction mined: ${response.hash}`);
        });
        smartAccount.on('error', (response: any) => {
            console.log('error event received via emitter', response);
        });

        // Sending gasless transaction
        const txResponse = await smartAccount.sendTransaction({ transaction: tx1 });
        console.log('userOp hash', txResponse.hash);
        // If you do not subscribe to listener, one can also get the receipt like shown below 
        const txReciept = await txResponse.wait();
        console.log('Tx hash', txReciept.transactionHash);
    } catch (err) {
        console.log('errorin', err);
    }
}





