import React, { useCallback, useContext, useEffect, useState } from "react";
import styles from "./EventInfoPage.module.css";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { EventTicketFactoryContext } from "../../Context/NFTContext";

const MyEventInfoPage = () => {
	const { fetchEventDetails, fetchEventCustomers } = useContext(
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
	const [customers, setCustomers] = useState([]);

	const fetchEvent = useCallback(async (eventAddress) => {
		const data = await fetchEventDetails(eventAddress);
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
		const customersData = await fetchEventCustomers(eventAddress);
		setCustomers(customersData);
	});
	useEffect(() => {
		const onReload = () => {
			const eventAddress = window.location.pathname.split("/")[3];
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
					<div className={styles.eventInfoCard}>
						<div className={styles.eventInfoDetails}>
							<span className={styles.eventInfoName}>
								Customers
							</span>
							<span
								className={styles.eventInfoDesc}
								style={{ marginTop: "20px" }}
							>
								{customers.map((val, index) => {
									return <span>{val}</span>;
								})}
							</span>
						</div>
						<div></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyEventInfoPage;
