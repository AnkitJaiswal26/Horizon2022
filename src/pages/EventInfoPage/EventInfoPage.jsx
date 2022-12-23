import React from "react";
import styles from "./EventInfoPage.module.css";
import { useNavigate } from "react-router-dom";

const EventInfoPage = () => {
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
              <span className={styles.eventInfoName}>Event Name</span>
              <span className={styles.eventInfoDesc}>
                Anuv Jain is an Indian singer, songwriter and composer. Having
                made his professional debut with the single Baarishein in 2016,
                he has since recorded nine tracks.Anuv Jain was born on 11 March
                1995 in Ludhiana. He has a twin sister, Anigha Jain, who is a
                make-up artist. Jain attended Sacred Heart Convent School,
                Sarabha Nagar in Ludhiana, before completing a Bachelor's of
                Business Administration from Narsee Monjee Institute of
                Management, Mumbai.
              </span>
              <span className={styles.eventInfoPrice}>
                Ticket Price: 0.1 ETH
              </span>
              <div>
                <button className={styles.eventTicketBuyBtn}>Buy Ticket</button>
              </div>
            </div>
            <div className={styles.eventInfoImage}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfoPage;
