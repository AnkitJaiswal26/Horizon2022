import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ExploreEvents.module.css";
import { EventTicketFactoryContext } from "../../Context/NFTContext";

const ExploreMyEvents = () => {
	const navigate = useNavigate();
	const { fetchMyEvents } = useContext(EventTicketFactoryContext);

	const [eventsList, setEventsList] = useState([]);

	const fetchData = useCallback(async () => {
		const data = await fetchMyEvents();
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
					Back to Dashboard
				</div>
			</div>{" "}
			<div className={styles.eventPageBody}>
				<div className={styles.searchEventsContainer}>
					<span className={styles.searchEventsTitle}>
						Search Event by Address
					</span>
					<input
						className={styles.eventSearchInput}
						type="text"
						placeholder="Event Address"
					/>
				</div>
				<div className={styles.exploreEventsContainer}>
					<span className={styles.exploreEventsTitle}>
						Explore Events
					</span>
					<div className={styles.eventsListGrid}>
						{eventsList.map((event, id) => {
							return (
								<div id={id} className={styles.eventBox}>
									<div
										onClick={() => {
											navigate(
												`/myevents/eventinfo/${event.eventAddress}`
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
													`/myevents/eventinfo/${event.eventAddress}`
												);
											}}
											className={styles.registerBtn}
										>
											<span>Explore</span>
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

export default ExploreMyEvents;
