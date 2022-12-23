import React, { useState, useContext, useRef } from "react";
import styles from "./OrganizeEventPage.module.css";
import { EventTicketFactoryContext } from "../../Context/NFTContext";
import { useNavigate } from "react-router-dom";
import UploadToIPFS from "../../ipfs";

const OrganizeEventPage = () => {
  const { uploadFilesToIPFS, createEvent } = useContext(
    EventTicketFactoryContext
  );
  const navigate = useNavigate();

  const uploadSymbolImageInput = useRef(null);
  const uploadPosterImageInput = useRef(null);

  const [name, setName] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventSymbol, setEventSymbol] = useState("");
  const [eventPoster, setEventPoster] = useState("Select file");
  const [eventPosterFile, setEventPosterFile] = useState(null);
  const [price, setPrice] = useState(1.0);
  const [supply, setSupply] = useState(1.0);
  const [isChecked, setIsChecked] = useState(true);

  const handlePosterUploadImage = (e) => {
    e.preventDefault();
    uploadPosterImageInput.current.click();
  };

  const handlePosterFileChange = (e) => {
    setEventPoster(e.target.files[0].name);
    setEventPosterFile(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !isChecked ||
      eventSymbol === "" ||
      name === "" ||
      eventPosterFile === ""
    ) {
      alert("Enter all details first");
      return;
    }

    try {
      console.log("In the code....");
      const cid = await uploadFilesToIPFS(eventPosterFile);
      console.log(cid);
      await createEvent(
        name,
        eventSymbol,
        cid,
        eventPoster,
        eventDescription,
        price,
        supply
      );
      navigate("/");
    } catch (err) {
      console.log(err);
      return;
    }
  };

  return (
    <div
      className={`w-full h-screen flex justify-center items-center ${styles.wrapper}`}
    >
      <div className={`${styles.mainContainer}`}>
        <div className={`${styles.contentBox}`}>
          <h2>Create an Event</h2>
        </div>
        <div className={`${styles.formBox}`}>
          <form onSubmit={handleSubmit}>
            <h2 className={`${styles.heading}`}>Fill Details</h2>

            <div className={`${styles.inputContainer}`}>
              <label className={`${styles.inputLabel}`}>Event Name</label>
              <input
                className={styles.input}
                type="username"
                placeholder="Enter event name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={`${styles.inputLabel}`}>Event Symbol</label>
              <input
                className={styles.input}
                type="username"
                placeholder="Enter 3 letter Symbol"
                onChange={(e) => setEventSymbol(e.target.value)}
                value={eventSymbol}
              />
            </div>
            <div className={styles.inputGroup}>
              <label className={`${styles.inputLabel}`}>
                Event Description
              </label>
              <input
                className={styles.input}
                type="username"
                placeholder="Describe your event"
                onChange={(e) => setEventDescription(e.target.value)}
                value={eventDescription}
              />
            </div>
            <div className={styles.both}>
              <div className={`${styles.inputContainer}`}>
                <label className={`${styles.inputLabel}`}>Ticket Price</label>
                <input
                  className={styles.inputCombined}
                  type="number"
                  placeholder="Enter ticket Price"
                  onChange={(e) => setPrice(e.target.value)}
                  value={price}
                />
              </div>
              <div className={`${styles.inputContainer}`}>
                <label className={`${styles.inputLabel}`}>Total Supply</label>
                <input
                  className={styles.inputCombined}
                  type="number"
                  placeholder="Enter ticket Price"
                  onChange={(e) => setSupply(e.target.value)}
                  value={supply}
                />
              </div>
            </div>

            <div className={styles.inputGroupLast}>
              <label className={`${styles.inputLabel}`}>
                Upload Event Poster
              </label>
              <button
                onClick={handlePosterUploadImage}
                className={styles.inputCombined}
              >
                {eventPoster}
              </button>
              <input
                onChange={handlePosterFileChange}
                ref={uploadPosterImageInput}
                accept="image/*"
                className={` ${styles.fileInput}`}
                type="file"
                placeholder={""}
              />
            </div>

            <div className={styles.button}>
              <a className={styles.anchor} onClick={handleSubmit} href="/">
                <span className="ml-4">Create</span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrganizeEventPage;
