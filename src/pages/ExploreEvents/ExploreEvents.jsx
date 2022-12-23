import React from "react";
import styles from './ExploreEvents.module.css';

const ExploreEvents = () => {

    const eventsList = [
        {
            name: "Event Name 1",
            desc: "Description"
        },
        {
            name: "Event Name 1",
            desc: "Description"
        },
        {
            name: "Event Name 1",
            desc: "Description"
        },
        {
            name: "Event Name 1",
            desc: "Description"
        },
        {
            name: "Event Name 1",
            desc: "Description"
        },
    ]

    return (
        <div className={styles.eventsPageContainer}>
            <div className={styles.eventPageHeader}>
                De-Tickets
            </div>
            <div className={styles.eventPageBody}>
                <div className={styles.searchEventsContainer}>
                    <span className={styles.searchEventsTitle}>Search Event by Address</span>
                    <input className={styles.eventSearchInput} type="text" placeholder="Event Address"/>
                </div>
                <div className={styles.exploreEventsContainer}>
                    <span className={styles.exploreEventsTitle}>Explore Events</span>
                    <div className={styles.eventsListGrid}>
                        {
                            eventsList.map((event) => {
                                return <div className={styles.eventsCard}>
                                <span className={styles.eventName}>Event Name</span>
                                <span className={styles.eventDescription}>Description</span>
                            </div>;
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExploreEvents;