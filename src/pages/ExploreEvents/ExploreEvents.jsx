import React from "react";
import styles from "./ExploreEvents.module.css";
import { useNavigate } from "react-router-dom";

const ExploreEvents = () => {
  const navigate = useNavigate();

  const eventsList = [
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
  ];

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
          <span className={styles.exploreEventsTitle}>Explore Events</span>
          <div className={styles.eventsListGrid}>
            {eventsList.map((event) => {
              return (
                <div className={styles.gridEvents}>
                  <div className={styles.eventBox}>
                    <button
                      onClick={() => {
                        navigate("/registerPerson");
                      }}
                      className={styles.eventName}
                      style={{
                        marginRight: "40px",
                      }}
                    >
                      <span>event.name</span>
                    </button>
                    {/* <img src={{ image }} /> */}
                    <div className={styles.eventDescription}>event.desc</div>
                    <div>Ticket Prize</div>
                    <div>
                      <button
                        onClick={() => {
                          navigate("/registerPerson");
                        }}
                        className={styles.registerBtn}
                        style={{
                          marginRight: "40px",
                        }}
                      >
                        <span>Buy</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate("/registerPerson");
                        }}
                        className={styles.registerBtn}
                        style={{
                          marginRight: "40px",
                        }}
                      >
                        <span>Sell</span>
                      </button>
                    </div>
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

export default ExploreEvents;
