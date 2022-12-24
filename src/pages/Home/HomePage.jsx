import react, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import { NFTTicketProvider } from "../../Context/NFTContext";
// import image from "../../../images/1.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(0);
  const state = useContext(NFTTicketProvider);

  useEffect(() => {
    console.log("state", state);
  });
  const getPage = () => {
    if (userRole == 0) {
      return (
        <div className={styles.homePageContainer}>
          <style>
            @import
            url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Libre+Baskerville:wght@400;700&family=Lobster&family=Lobster+Two:ital@1&family=Poppins:wght@100;300&family=Quintessential&family=Shizuru&family=Ubuntu+Mono&family=Solway&family=Secular+One&family=Fira+Sans:ital,wght@1,500&display=swap');
          </style>
          <div className={styles.combined}>
            <div className={styles.navBarContainer}>
              <div className={styles.navBarContent}>
                <div className={styles.navBarContentLeft}>
                  <span
                    onClick={() => {
                      navigate("/");
                    }}
                  >
                    Secure Ticket
                  </span>
                </div>
                <div className={styles.navBarContentRight}>
                  <span
                    onClick={() => {
                      navigate("/organizeevent");
                    }}
                  >
                    Oragnize an Event
                  </span>
                  <span
                    onClick={() => {
                      navigate("/dashboard");
                    }}
                  >
                    My Dashboard
                  </span>
                  <span
                    onClick={() => {
                      navigate("/resell");
                    }}
                  >
                    Sell ticket
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.mainContainer}>
              <div className={styles.mainContent}>
                <span className={styles.tagLine}>De-Ticket</span>
                <span className={styles.lowerLine}>
                  {" "}
                  A safe platform for creating, selling, and buying tickets in
                  the most magical and easy way possible .
                </span>
                <div className={styles.btns}>
                  <button
                    onClick={() => {
                      navigate("/events");
                    }}
                    className={styles.registerBtn}
                    style={{
                      marginRight: "40px",
                    }}
                  >
                    <span>Explore now!</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <div>Page not found</div>;
    }
  };

  return <div>{getPage()}</div>;
};

export default HomePage;
