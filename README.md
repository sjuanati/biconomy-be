# Biconomy SDK Test

## Overview

This project is a Node.js application that interacts with Biconomy SDK to test three different gasless transaction flows: ERC20, ERC721, and batch transactions. The application uses Biconomy's Meta Transaction API, which enables users to sign transactions using their private key and Biconomy relays those transactions on their behalf through Ethereum's account abstraction ERC-4337

## Installation

1. Clone the repository to your local machine.
2. Run `yarn install` to install all the dependencies required for the application.

## Configuration

1. Rename `.env.example` to `.env`.
2. In the `.env` file, enter your Biconomy API key and secret, and your private key.
3. Update the `contractAddress` and `contractABI` variables in the `index.js` file with the address and ABI of the contract you want to interact with.

## Usage

1. `yarn start` -> Check SCW balance
2. `yarn start` -> ERC-20 gasless transaction (send 1 USDC to recipient)
3. `yarn start` -> ERC-721 gasless transaction (send 1 NFT to recipient) *
4. `yarn start` -> gasless batch transaction (send 1 USDC to multiple recipients)

## Notes
1. The paymaster needs to be funded through the dashboard at https://dashboard.biconomy.io/
2. The SCW must own the ERC20/ERC-721 assets to be transferred through gasless transactions
