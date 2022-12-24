// import React, { useCallback, useContext, useEffect, useState } from "react";
// import styles from "./EventInfoPage.module.css";
// import { useNavigate } from "react-router-dom";
// import { EventTicketFactoryContext } from "../../Context/NFTContext";
// import { ethers } from "hardhat";

// const EventInfoPage = ({ match }) => {
// 	// const { fetchEventDetails } = useContext(EventTicketFactoryContext);

// 	const [event, setEvent] = useState({
// 		name: "",
// 		symbol: "",
// 		cid: "",
// 		description: "",
// 		price: 0,
// 		supply: 0,
// 		eventAddress: "",
// 		marketplaceAddress: "",
// 	});

// 	// const fetchEvent = useCallback(async (eventAddress) => {
// 	// 	const data = await fetchEventDetails(eventAddress);
// 	// 	setEvent({
// 	// 		name: data[0],
// 	// 		symbol: data[1],
// 	// 		cid: data[2],
// 	// 		description: data[3],
// 	// 		price: ethers.utils.formatUnits(data[4]._hex.toString(), "ether"),
// 	// 		supply: ethers.utils.formatUnits(data[5]._hex.toString(), "ether"),
// 	// 		eventAddress: eventAddress,
// 	// 		marketplaceAddress: data[6],
// 	// 	});
// 	// });

import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./EventInfoPage.module.css";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { EventTicketFactoryContext } from "../../Context/NFTContext";

const EventInfoPage = () => {
	const { fetchEventDetails, retrieveFiles } = useContext(
		EventTicketFactoryContext
	);

	const [event, setEvent] = useState({
		name: "",
		symbol: "",
		cid: "",
		description: "",
		price: 0,
		supply: 0,
		eventAddress: "",
		marketplaceAddress: "",
	});

	const fetchEvent = useCallback(async (eventAddress) => {
		const data = await fetchEventDetails(eventAddress);
		console.log(data);
		setEvent({
			name: data.eventName,
			symbol: data.eventSymbol,
			cid: data.imageHash,
			imageName: data.imageName,
			description: data.description,
			price: ethers.utils.formatUnits(
				data.ticketPrice._hex.toString(),
				"ether"
			),
			supply: ethers.utils.formatUnits(
				data.totalSupply._hex.toString(),
				"ether"
			),
			marketplaceAddress: data.marketplace,
			eventAddress: eventAddress,
		});
		await retrieveFiles(data[2]);
	});
	useEffect(() => {
		const onReload = () => {
			const eventAddress = window.location.pathname.split("/")[2];
			fetchEvent(eventAddress).catch((err) => console.log(err));
		};
		onReload();
	}, []);
	const navigate = useNavigate();

	return (
		<div className={styles.eventsPageContainer}>
			<div className={styles.eventPageHeader}>
				<div>De-Tickets</div>
				<div
					className={styles.backpage}
					onClick={() => {
						navigate("/events");
					}}
				>
					Back to events
				</div>
			</div>
			<div className={styles.eventPageBody}>
				<div className={styles.eventInfoContainer}>
					<span className={styles.eventInfoTitle}>Event Info</span>
					<div className={styles.eventInfoCard}>
						<div className={styles.eventInfoDetails}>
							<span className={styles.eventInfoName}>
								{event.name}
							</span>
							<span className={styles.eventInfoDesc}>
								{event.description}
							</span>
							<span className={styles.eventInfoPrice}>
								Ticket Price: {event.price} ETH
							</span>
							<div>
								<button
									className={styles.eventTicketBuyBtn}
									onClick={() => {
										navigate(
											`/purchaseticket/${event.eventAddress}`
										);
									}}
								>
									Buy Ticket
								</button>
							</div>
						</div>
						<div
							className={styles.eventInfoImage}
							style={{
								backgroundImage: `url('https://${event.cid}.ipfs.w3s.link/${event.imageName}')`,
							}}
						></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default EventInfoPage;
