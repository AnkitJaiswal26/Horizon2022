import react, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./HomePage.module.css";
import { NFTTicketContext } from "../../Context/NFTContext";

const HomePage = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(0);
  const state = useContext(NFTTicketContext);
  console.log("In home context", state);

  const getPage = () => {
    if (userRole == 0) {
      return (
        <div className={styles.homePageContainer}>
          <style>
            @import
            url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Libre+Baskerville:wght@400;700&family=Lobster&family=Lobster+Two:ital@1&family=Poppins:wght@100;300&family=Quintessential&family=Shizuru&family=Ubuntu+Mono&family=Solway&family=Secular+One&family=Fira+Sans:ital,wght@1,500&display=swap');
          </style>
          <div className={styles.navBarContainer}>
            <div className={styles.navBarContent}>
              <span>Secure Ticket</span>
            </div>
          </div>
          <div className={styles.lineSepeartor}></div>
          <div className={styles.mainContainer}>
            <div className={styles.mainContent}>
              <span className={styles.tagLine}>De-Ticket</span>
              <span className={styles.lowerLine}>
                {" "}
                A safe platform for creating, selling, and buying tickets in the
                most magical and easy way possible .
              </span>
              <div className={styles.btns}>
                <button
                  onClick={() => {
                    navigate("/registerPerson");
                  }}
                  className={styles.registerBtn}
                  style={{
                    marginRight: "40px",
                  }}
                >
                  <span>Register now!</span>
                </button>
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