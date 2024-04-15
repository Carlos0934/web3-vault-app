<p align="center">
    Web3 Vault Project 
</p>


## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)


## Introduction

Web3 Vault is a mobile application that allows users to store their files on the tangle iota testnet. The application uses the S3 to store the files and the shimmer test network  to store the file metadata. The application is built using Node.js, Flutter, and Solidity smart contracts.


## Features


- Store file metadata on the shimmer test network
- Retrieve file metadata from the shimmer test network
- Secure file storage using the S3
- Secure file metadata storage using the shimmer test network
- User email/password authentication
- Serverless API using AWS Lambda & API Gateway
- AES encryption for file metadata
- Tests for the smart contracts and the api endpoints
- Automated deployment of the API using AWS Github Actions & Serverless Framework
- Automated deployment of the smart contracts using Hardhat


## Technologies
- Flutter
- Node.js
- TypeScript
- Jwt
- Vitest (Testing Framework)
- Solidity
- AWS S3
- Shimmer Test Network
- Drizzle (Lightweight ORM)
- Web3.js
- IOTA Testnet
- AES Encryption
- AWS Lambda & API Gateway
- Serverless Framework


## Installation
- Clone the repository
- Install the flutter dependencies using `flutter pub get` in the app directory
- Install the node dependencies using `npm install` in the api directory
- Install hardhat project dependencies using `npm install` in the web3 directory


## Usage
- Start the flutter application using `flutter run` in the app directory
- Copy the .env.example file as .env  in the api directory and add the required environment variables
- Start the node.js server using `npm run dev` in the api directory
- Copy the .env.example file as .env  in the web3 directory and add the required environment variables
- Compile the smart contracts using `npx hardhat compile` in the web3 directory 
- Deploy the smart contracts using `npm run deploy` in the web3 directory


## License
[MIT](https://choosealicense.com/licenses/mit/)