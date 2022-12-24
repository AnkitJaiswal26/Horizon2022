import React, { useCallback, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import styles from "./Resell.module.css";
import { EventTicketFactoryContext } from "../../Context/NFTContext";

const Resell = () => {
	const navigate = useNavigate();
	const { getAllTicketsForSale, fetchMyTickets } = useContext(
		EventTicketFactoryContext
	);

	const [eventsList, setEventsList] = useState([]);

	const fetchData = useCallback(async () => {
		const data = await getAllTicketsForSale();
		console.log(data);
		setEventsList(data);
	}, []);

	useEffect(() => {
		fetchData().catch((err) => {
			console.log(err);
		});
	}, []);

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
					<div>
						<button
							className={styles.button}
							onClick={() => {
								navigate("/");
							}}
						>
							Add to resell
						</button>
					</div>
				</div>
				<div className={styles.exploreEventsContainer}>
					<span className={styles.exploreEventsTitle}>
						Tickets to Sell
					</span>
					<div className={styles.eventsListGrid}>
						{eventsList.map((event, id) => {
							return (
								<div id={id} className={styles.eventBox}>
									<div
										onClick={() => {
											navigate(
												`/eventinfo/${event.eventAddress}`
											);
										}}
										className={styles.eventName}
									>
										<span>{event.name}</span>
									</div>
									{/* <img src={{ image }} /> */}
									<div className={styles.eventDescription}>
										{event.desc}
									</div>
									<div>Ticket Price: {event.price}</div>
									<div>
										<button
											onClick={() => {
												navigate(
													`/purchaseresellticket`
												);
											}}
											className={styles.registerBtn}
										>
											<span>Buy</span>
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

export default Resell;
