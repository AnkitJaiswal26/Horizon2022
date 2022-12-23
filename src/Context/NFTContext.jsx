import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Wenb3Model from "web3modal";
import axios from "axios";
import { create as ipfsHTTPClient } from "ipfs-http-client";
import lighthouse from "@lighthouse-web3/sdk";

import { NFTTicketABI, NFTTicketAddress } from "./constants";

const fetchContract = (signerOrProvider) =>
	new ethers.Contract(NFTTicketAddress, NFTTicketABI, signerOrProvider);

const connectingWithSmartContract = async () => {
	try {
		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchContract(signer);
		return contract;
	} catch (error) {
		console.log("Something went wrong while connecting with contract!");
	}
};

export const NFTTicketContext = React.createContext();

export const NFTTicketProvider = ({ children }) => {
	const [currentAccount, setCurrentAccount] = useState("");

	// Check if wallet is connected
	const checkIfWalletConnected = async () => {
		try {
			if (!window.ethereum) return console.log("Install Metamask");
			const accounts = await window.ethereum.request({
				method: "eth_accounts",
			});
			if (accounts.length) {
				setCurrentAccount(accounts[0]);
			} else {
				console.log("No accounts found!");
			}
		} catch (error) {
			console.log("Someting wrong while connecting to wallet");
		}
	};

	useEffect(() => {
		checkIfWalletConnected();
	}, []);

	const connectWallet = async () => {
		try {
			const accounts = await window.ethereum.request({
				method: "eth_requestAccounts",
			});
			setCurrentAccount(accounts[0]);

			window.location.reload();
		} catch (error) {
			console.log("Error while connecting to wallet");
		}
	};

	return (
		<NFTTicketContext.Provider
			value={{
				checkIfWalletConnected,
				connectWallet,
				currentAccount,
			}}
		>
			{children}
		</NFTTicketContext.Provider>
	);
};
