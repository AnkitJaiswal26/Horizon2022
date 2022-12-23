import React, { useContext, useEffect, useState } from "react";
import styles from "./ExploreEvents.module.css";
import { EventTicketFactoryContext } from "../../Context/NFTContext";

const ExploreEvents = () => {
	const { getActiveEvents } = useContext(EventTicketFactoryContext);

	const [events, setEvents] = useState([
		{
			name: "Event Name 1",
			desc: "Description",
		},
		{
			name: "Event Name 1",
			desc: "Description",
		},
		{
			name: "Event Name 1",
			desc: "Description",
		},
		{
			name: "Event Name 1",
			desc: "Description",
		},
		{
			name: "Event Name 1",
			desc: "Description",
		},
	]);

	const getAllEvents = async () => {
		const data = await getActiveEvents();
		// setEvents(data);
	};

	useEffect(() => {
		getAllEvents();
	}, []);

	return (
		<div className={styles.eventsPageContainer}>
			<div className={styles.eventPageHeader}>De-Tickets</div>
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
						{events.map((event, index) => {
							return (
								<div className={styles.eventsCard} key={index}>
									<span className={styles.eventName}>
										Event Name
									</span>
									<span className={styles.eventDescription}>
										Description
									</span>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ExploreEvents;
