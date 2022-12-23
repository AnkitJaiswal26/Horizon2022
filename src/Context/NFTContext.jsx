import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import Wenb3Model from "web3modal";
import { Web3Storage } from "web3.storage";

import {
	EventMarketplaceABI,
	EventNFTABI,
	EventTicketFactoryABI,
	EventTicketFactoryAddress,
} from "./constants";

const web3AccessToken =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEFjNjkxYTc1NTFBODU3MzIzMTE2MWZEMzUyMUFEQ0MyNWFEQzIyOWMiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzE3ODk2NzI1MjUsIm5hbWUiOiJIYWNrQU1pbmVycyJ9._DQqNUq6VZ-Zg86ol1YHB0L4sWFtowhD6SSdSIRR23Y";
const web3Storage = new Web3Storage({ token: web3AccessToken });

const fetchEventMarketPlace = (contractAddress, signerOrProvider) =>
	new ethers.Contract(contractAddress, EventMarketplaceABI, signerOrProvider);

const fetchEventTicketFactory = (signerOrProvider) =>
	new ethers.Contract(
		EventTicketFactoryAddress,
		EventTicketFactoryABI,
		signerOrProvider
	);

const fetchEventNFT = (contractAddress, signerOrProvider) =>
	new ethers.Contract(contractAddress, EventNFTABI, signerOrProvider);

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
	console.log(obj);
	const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });
	const files = [new File([JSON.stringify(obj)], "ticket.txt")];
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

	const [userIPFSHash, setUserIPFSHash] = useState("");

	const createEvent = async (
		name,
		symbol,
		imageHash,
		imageName,
		description,
		price,
		supply
	) => {
		try {
			const eventTicketFactoryContract =
				await connectingWithEventTicketFactory();

			const res = await eventTicketFactoryContract.createNewEvent(
				name,
				symbol,
				imageHash,
				imageName,
				description,
				ethers.utils.parseUnits(price.toString(), "ether"),
				supply,
				{
					gasLimit: 30000000,
				}
			);

			const provider = new ethers.providers.JsonRpcProvider();
			const contract = fetchEventTicketFactory(provider);
			const _nftAddress = await contract.fetchNewEventAddress();
			const _nftMarketPlaceAddress =
				await contract.fetchNewEventMarketPlaceAddress();

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

	const fetchMyTickets = async (nftAddress) => {
		try {
			const provider = new ethers.providers.JsonRpcProvider();
			const nftInstance = fetchEventNFT(provider, nftAddress);
			const tickets = await nftInstance.getTicketsOfCustomer();
			console.log(tickets);
			return tickets;
		} catch (err) {
			console.log("Error in updating the ticket", err);
		}
	};

	const fetchEventDetails = async (eventAddress) => {
		try {
			const contract = await connectingWithEventTicketFactory();
			const data = await contract.getEventDetails(eventAddress);
			console.log(data);
			return data;
		} catch (err) {
			console.log(err);
		}
	};

	const getActiveEvents = async () => {
		try {
			console.log("Hello");
			const provider = new ethers.providers.JsonRpcProvider();
			const contract = fetchEventTicketFactory(provider);
			const data = await contract.getActiveEvents();

			var result = [];
			for (let i = 0; i < data.length; i++) {
				const eventData = await fetchEventDetails(data[i]);
				console.log(eventData);
				result.push({
					name: eventData.eventName,
					symbol: eventData.eventSymbol,
					cid: eventData.imageHash,
					imageName: eventData.imageName,
					description: eventData.description,
					price: ethers.utils.formatUnits(
						eventData.ticketPrice._hex.toString(),
						"ether"
					),
					supply: ethers.utils.formatUnits(
						eventData.totalSupply._hex.toString(),
						"ether"
					),
					eventAddress: data[i],
					marketplaceAddress: eventData.marketplace,
				});
			}
			return result;
		} catch (err) {
			console.log(err);
		}
	};

	const onPurchaseTicket = async (marketplace, price, cid) => {
		console.log(marketplace);
		try {
			const marketplaceInstance = await connectingWithEvenMarketPlace(
				marketplace
			);
			console.log("hello");
			await marketplaceInstance.purchaseTicket(cid, {
				value: ethers.utils.parseUnits(price.toString(), "ether"),
			});

			return true;
		} catch (err) {
			console.log("Error while creating new festival", err);
		}
	};

	const onSecondaryPurchaseTicket = async (
		marketplace,
		ticketId,
		price,
		cid
	) => {
		try {
			const marketplaceInstance = await connectingWithEvenMarketPlace(
				marketplace
			);
			await marketplaceInstance.secondaryPurchase(ticketId, cid, {
				value: ethers.utils.parseUnits(price.toString(), "ether"),
			});

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

	const getAllCustomers = async (contractAddress) => {
		try {
			const contract = await connectingWithEventNFT(contractAddress);
			const users = await contract.getAllCustomers();
			console.log(users);
			return users;
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
			console.log(files);
			// return "";
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

	return (
		<EventTicketFactoryContext.Provider
			value={{
				userIPFSHash,
				checkIfWalletConnected,
				connectWallet,
				currentAccount,
				createEvent,
				fetchMyTickets,
				getActiveEvents,
				onPurchaseTicket,
				onSecondaryPurchaseTicket,
				listForSale,
				addUser,
				fetchUser,
				uploadJSONToIPFS,
				uploadFilesToIPFS,
				fetchEventDetails,
				getAllCustomers,
			}}
		>
			{children}
		</EventTicketFactoryContext.Provider>
	);
};
