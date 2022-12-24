import React, { useCallback, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "./Resell.module.css";
import { EventTicketFactoryContext } from "../../Context/NFTContext";
import { ethers } from "ethers";
const MyTickets = () => {
	const navigate = useNavigate();
	const { fetchMyTickets, listForSale } = useContext(
		EventTicketFactoryContext
	);

	const [eventsList, setEventsList] = useState([]);

	const fetchData = useCallback(async () => {
		const data = await fetchMyTickets();
		console.log(data);
		setEventsList(data);
	}, []);

	useEffect(() => {
		fetchData().catch((err) => {
			console.log(err);
		});
	}, []);

	const addToSale = (e, index) => {
		e.preventDefault();
		listForSale(
			eventsList[index].ticketId,
			eventsList[index].ticketPrice,
			eventsList[index].marketplace,
			eventsList[index].eventAddress
		);
	};

	return (
		<div className={styles.eventsPageContainer}>
			<div className={styles.eventPageHeader}>
				<div>De-Tickets</div>
				<div
					className={styles.backpage}
					onClick={() => {
						navigate("/");
					}}
				>
					Back to Home
				</div>
			</div>{" "}
			<div className={styles.eventPageBody}>
				<div className={styles.resellPageNavbar}>
					<div className={styles.searchEventsContainer}>
						<span className={styles.searchEventsTitle}>
							Search Ticket by Address
						</span>
						<input
							className={styles.eventSearchInput}
							type="text"
							placeholder="Event Address"
						/>
					</div>
				</div>
				<div className={styles.exploreEventsContainer}>
					<span className={styles.exploreEventsTitle}>
						My Tickets
					</span>
					<div className={styles.eventsListGrid}>
						{eventsList.map((event, id) => {
							return (
								<div id={id} className={styles.eventBox}>
									<div
										onClick={(e) => {
											addToSale(e, id);
										}}
										className={styles.eventName}
									>
										<span>{event.eventName}</span>
									</div>
									{/* <img src={{ image }} /> */}
									<div className={styles.eventDescription}>
										{event.description}
									</div>
									{/* <div>
										Ticket Price:{" "}
										{ethers.utils.parseUnits(
											event.ticketPrice._hex.toString(),
											"ether"
										)}
									</div> */}
									<div>
										<button
											onClick={(e) => {
												addToSale(e, id);
											}}
											className={styles.registerBtn}
										>
											<span>Sell</span>
										</button>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MyTickets;
