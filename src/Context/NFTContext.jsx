import React, { useState, useEffect, useContext } from "react";
import { ethers } from "ethers";
import Wenb3Model from "web3modal";
import axios from "axios";
import { create as ipfsHTTpClient } from "ipfs-http-client";
import lighthouse from "@lighthouse-web3/sdk";
import { Web3Storage } from "web3.storage";

import {
	EventMarketplaceABI,
	EventNFTABI,
	EventTicketFactoryABI,
	EventTokenABI,
	EventTicketFactoryAddress,
	EventTokenAddress,
} from "./constants";

const projectId = "your project id";
const projectSecretKey = "secret key";
const web3AccessToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEFjNjkxYTc1NTFBODU3MzIzMTE2MWZEMzUyMUFEQ0MyNWFEQzIyOWMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzE3ODk2NzI1MjUsIm5hbWUiOiJIYWNrQU1pbmVycyJ9._DQqNUq6VZ-Zg86ol1YHB0L4sWFtowhD6SSdSIRR23Y";
const web3Storage = new Web3Storage({ token: web3AccessToken });

const subdomain = "your subdomain";

const fetchEventMarketPlace = (contractAddress, signerOrProvider) =>
	new ethers.Contract(contractAddress, EventMarketplaceABI, signerOrProvider);

const fetchEventTicketFactory = (signerOrProvider) =>
	new ethers.Contract(
		EventTicketFactoryAddress,
		EventTicketFactoryABI,
		signerOrProvider
	);

const fetchEventToken = (signerOrProvider) =>
	new ethers.Contract(EventTokenAddress, EventTokenABI, signerOrProvider);

const fetchEventNFT = (contractAddress, signerOrProvider) =>
	new ethers.Contract(contractAddress, EventNFTABI, signerOrProvider);

const connectingWithEventToken = async () => {
	try {
		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchEventToken(EventTokenAddress, signer);
		return contract;
	} catch (error) {
		console.log("Something went wrong while connecting with contract!");
	}
};

const connectingWithEventTicketFactory = async () => {
	try {
		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchEventTicketFactory(signer);
		return contract;
	} catch (error) {
		console.log("Something went wrong while connecting with contract!");
	}
};

const connectingWithEvenMarketPlace = async (contractAddress) => {
	try {
		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchEventMarketPlace(contractAddress, signer);
		return contract;
	} catch (error) {
		console.log("Something went wrong while connecting with contract!");
	}
};

const connectingWithEventNFT = async (contractAddress) => {
	try {
		const web3Modal = new Wenb3Model();
		const connection = await web3Modal.connect();
		const provider = new ethers.providers.Web3Provider(connection);
		const signer = provider.getSigner();
		const contract = fetchEventNFT(contractAddress, signer);
		return contract;
	} catch (error) {
		console.log("Something went wrong while connecting with contract!");
	}
};

const makeFileObjects = (obj) => {
	const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });
	const files = [
		new File(["contents-of-file-1"], "plain-utf8.txt"),
		new File([blob], "hello.json"),
	];
	return files;
};

export const EventTicketFactoryContext = React.createContext();

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
				console.log("Current Account", currentAccount);
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

	const [eventNFTAddress, setEventNFTAddress] = useState("");
	const [eventMarketplaceAddress, setEvenMarketplaceAddress] = useState("");
	const [userIPFSHash, setUserIPFSHash] = useState("");

	const fetchAccount = async () => {
		try {
			const provider = new ethers.providers.JsonRpcProvider();
			const contract = fetchEventTicketFactory(provider);
			const data = await contract.getActiveEvents();
			console.log(data);
		} catch (err) {
			console.log(err);
		}
	};
	const createEvent = async (name, symbol, imageHash, price, supply) => {
		try {
			const eventTicketFactoryContract =
				await connectingWithEventTicketFactory();

			const res = await eventTicketFactoryContract.createNewEvent(
				EventTokenAddress,
				name,
				symbol,
				imageHash,
				ethers.utils.parseUnits(price.toString(), "ether"),
				supply,
				{
					gasLimit: 30000000,
				}
			);

			const provider = new ethers.providers.JsonRpcProvider();
			const contract = fetchEventTicketFactory(provider);
			const _nftAddress = await contract.fetchNewEventAddress();
			setEventNFTAddress(_nftAddress);
			const _nftMarketPlaceAddress =
				await contract.fetchNewEventMarketPlaceAddress();
			setEventNFTAddress(_nftMarketPlaceAddress);

			console.log(_nftAddress, _nftMarketPlaceAddress);
			const nftInstance = await connectingWithEventNFT(_nftAddress);
			const batches = Math.ceil(supply / 30);
			let batchSupply = 30;
			let curCount = 0;
			let prevCount = 0;
			console.log(_nftAddress, _nftMarketPlaceAddress);

			if (supply < 30) {
				const res = await nftInstance.bulkMintTickets(
					supply,
					_nftMarketPlaceAddress
				);
			} else {
				for (let i = 0; i < batches; i++) {
					prevCount = curCount;
					curCount += 30;
					if (supply < curCount) {
						batchSupply = supply - prevCount;
					}
					const res = await nftInstance.bulkMintTickets(
						batchSupply,
						_nftMarketPlaceAddress
					);
				}
			}
			return { _nftAddress, _nftMarketPlaceAddress };
		} catch (err) {
			console.log("Error while creating new festival", err);
		}
	};

	const fetchMyTickets = async () => {
		try {
			const provider = new ethers.providers.JsonRpcProvider();
			const nftInstance = fetchEventNFT(provider);
			const tickets = await nftInstance.getTicketsOfCustomer();
			console.log(tickets);
			return tickets;
		} catch (err) {
			console.log("Error in updating the ticket", err);
		}
	};

	const fetchEventDetails = async (eventAddress) => {
		try {
			const provider = new ethers.providers.JsonRpcProvider();
			const contract = fetchEventTicketFactory(provider);
			const data = await contract.getEventDetails(eventAddress);
			console.log(data);
			return data;
		} catch (err) {
			console.log(err);
		}
	};

	const getActiveEvents = async () => {
		try {
			const provider = new ethers.providers.JsonRpcProvider();
			const contract = fetchEventTicketFactory(provider);
			const data = await contract.getActiveEvents();
			var result = [];
			for (let i = 0; i < data.length; i++) {
				result.push(fetchEventDetails(data[i]));
			}
			return result;
		} catch (err) {
			console.log(err);
		}
	};

	// TODO: to be completed properly
	const onPurchaseTicket = async (marketplace, ticketPrice, initiator) => {
		try {
			const marketplaceInstance = await connectingWithEvenMarketPlace(
				eventMarketplaceAddress
			);
			const eventToken = await connectingWithEventToken();
			await eventToken.approve(eventMarketplaceAddress, ticketPrice);
			await marketplaceInstance.purchaseTicket();

			return true;
		} catch (err) {
			console.log("Error while creating new festival", err);
		}
	};

	// TODO: to be completed properly
	const onSecondaryPurchaseTicket = async (
		ticketId,
		ticketPrice,
		initiator
	) => {
		try {
			const marketplaceInstance = await connectingWithEvenMarketPlace(
				eventMarketplaceAddress
			);
			const eventToken = await connectingWithEventToken();
			await eventToken.approve(eventMarketplaceAddress, ticketPrice);
			await marketplaceInstance.secondaryPurchase(ticketId);

			return true;
		} catch (err) {
			console.log("Error while creating new festival", err);
		}
	};

	const listForSale = async (ticket, price, marketplace) => {
		try {
			const provider = new ethers.providers.JsonRpcProvider();
			const nftInstance = fetchEventNFT(provider);
			await nftInstance.setSaleDetails(
				ticket,
				ethers.utils.parseUnits(price.toString(), "ether"),
				marketplace
			);
			return true;
		} catch (err) {
			console.log("Error while lisitng for sale", err);
		}
	};

	const addUser = async (tokenURI) => {
		try {
			const contract = await connectingWithEventTicketFactory();
			await contract.registerUser(tokenURI);
		} catch (err) {
			console.log(err);
		}
	};

	const fetchUser = async () => {
		try {
			const provider = new ethers.providers.JsonRpcProvider();
			const contract = await fetchEventTicketFactory(provider);
			const user = await contract.getUser();
			setUserIPFSHash(user);
			return user;
		} catch (err) {
			console.log(err);
		}
	};

	// Upload to IPFS account
	const uploadJSONToIPFS = async (data) => {
		try {
			const files = makeFileObjects(data);
			const cid = await web3Storage.put(files);
			return cid;
		} catch (error) {
			console.log("Error uploading to IPFS");
		}
	};

	const uploadFilesToIPFS = async (file) => {
		try {
			const cid = await web3Storage.put(file);
			return cid;
		} catch (err) {
			console.log(err);
		}
	};

	const [myname, setMyname] = useState("Tanish");

	return (
		<EventTicketFactoryContext.Provider
			value={{
				checkIfWalletConnected,
				connectWallet,
				currentAccount,
				myname,
				createEvent,
			}}
		>
			{children}
		</EventTicketFactoryContext.Provider>
	);
};
