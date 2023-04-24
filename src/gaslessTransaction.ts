import { ERC } from './utils/types';
import { ADDR } from './utils/constants';
import {
    ethers,
    BigNumber,
} from "ethers";


const buildPayload = async (
    smartAccount: any,
    recipientAddress: string,
    amount: BigNumber,
    tokenId: string,
    erc: ERC,
): Promise<string | undefined> => {
    const scwAddress = await smartAccount.address;
    switch (erc) {
        case ERC.ERC20:
            const erc20Interface = new ethers.utils.Interface([
                'function transfer(address _to, uint256 _value)'
            ]);
            return erc20Interface.encodeFunctionData(
                'transfer', [recipientAddress, amount]
            );
        case ERC.ERC721:
            const erc721Interface = new ethers.utils.Interface([
                'function safeTransferFrom(address _from, address _to, uint256 _tokenId)'
            ]);
            return erc721Interface.encodeFunctionData(
                'safeTransferFrom', [ADDR.TOKEN721, recipientAddress, tokenId]
            );
        case ERC.ERC1155:
            const erc1155Interface = new ethers.utils.Interface([
                'function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _value, bytes calldata _data)'
            ]);
            // Encode the transfer of the collectible to recipient
            return erc1155Interface.encodeFunctionData(
                'safeTransferFrom', ['0xTBC', recipientAddress, tokenId, amount, '0x']
            );
        default:
            throw new Error("Invalid ERC type.");
    }
}

/// @dev: the SCW must have ETH and the token that will be transferred (e.g.: USDC)
/// @dev: the contract of the token to be transferred must be added in Biconomy's Dashboard
export const sendGaslessTx = async (
    smartAccount: any,
    recipientAddress: string,
    amount: BigNumber,
    tokenId: string,
    erc: ERC,
) => {
    try {
        const payload = await buildPayload(
            smartAccount,
            recipientAddress,
            amount,
            tokenId,
            erc,
        );
        if (!payload) {
            throw new Error("Failed to build payload");
        }
        const tx = {
            to: ADDR.USDC,
            data: payload,
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
        const txResponse = await smartAccount.sendTransaction({ transaction: tx });
        console.log('userOp hash', txResponse.hash);
        // If you do not subscribe to listener, one can also get the receipt like shown below 
        const txReciept = await txResponse.wait();
        console.log('Tx hash', txReciept.transactionHash);
    } catch (err) {
        console.log('errorin', err);
    }
}





