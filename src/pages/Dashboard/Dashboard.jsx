import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import { EventTicketFactoryContext } from "../../Context/NFTContext";
const Dashboard = () => {
  const navigate = useNavigate();
  const eventsList = [
    {
      name: "Event Name 1",
      desc: "Anuv Jain is an Indian singer, songwriter and composer. Having made his professional debut with the single Baarishein in 2016, he has since recorded nine tracks.Anuv Jain was born on 11 March 1995 in Ludhiana... ",
      price: "1.1Eth",
    },
    {
      name: "Event Name 2",
      desc: "Anuv Jain is an Indian singer, songwriter and composer. Having made his professional debut with the single Baarishein in 2016, he has since recorded nine tracks.Anuv Jain was born on 11 March 1995 in Ludhiana... ",
      price: "1.1Eth",
    },
    {
      name: "Event Name 3",
      desc: "Anuv Jain is an Indian singer, songwriter and composer. Having made his professional debut with the single Baarishein in 2016, he has since recorded nine tracks.Anuv Jain was born on 11 March 1995 in Ludhiana... ",
      price: "1.1Eth",
    },
    {
      name: "Event Name 4",
      desc: "Anuv Jain is an Indian singer, songwriter and composer. Having made his professional debut with the single Baarishein in 2016, he has since recorded nine tracks.Anuv Jain was born on 11 March 1995 in Ludhiana... ",
      price: "1.1Eth",
    },
    {
      name: "Event Name 5",
      desc: "Anuv Jain is an Indian singer, songwriter and composer. Having made his professional debut with the single Baarishein in 2016, he has since recorded nine tracks.Anuv Jain was born on 11 March 1995 in Ludhiana... ",
      price: "1.1Eth",
    },
  ];

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
        <div className={styles.exploreEventsContainer}>
          <span className={styles.exploreEventsTitle}>My Tickets</span>
          <div className={styles.eventsListGrid}>
            {eventsList.map((event, id) => {
              return (
                <div id={id} className={styles.eventBox}>
                  <div
                    onClick={() => {
                      navigate(`/eventinfo/${event.eventAddress}`);
                    }}
                    className={styles.eventName}
                  >
                    <span>{event.name}</span>
                  </div>
                  {/* <img src={{ image }} /> */}
                  <div className={styles.eventDescription}>{event.desc}</div>
                  <div>Ticket Price: {event.price}</div>
                  <div>
                    <button
                      onClick={() => {
                        navigate(`/eventinfo/${event.eventAddress}`);
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
        <div className={styles.breakLine}></div>
        <div className={styles.exploreEventsContainer}>
          <span className={styles.exploreEventsTitle}>My Events</span>
          <div className={styles.eventsListGrid}>
            {eventsList.map((event, id) => {
              return (
                <div id={id} className={styles.eventBox}>
                  <div
                    onClick={() => {
                      navigate(`/eventinfo/${event.eventAddress}`);
                    }}
                    className={styles.eventName}
                  >
                    <span>{event.name}</span>
                  </div>
                  {/* <img src={{ image }} /> */}
                  <div className={styles.eventDescription}>{event.desc}</div>
                  <div>Ticket Price: {event.price}</div>
                  <div>
                    <button
                      onClick={() => {
                        navigate(`/eventinfo/${event.eventAddress}`);
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

export default Dashboard;
