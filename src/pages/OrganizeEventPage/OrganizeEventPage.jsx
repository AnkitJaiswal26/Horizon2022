import React, { useState, useContext, useRef } from "react";
import styles from "./OrganizeEventPage.module.css";
import { EventTicketFactoryContext } from "../../Context/NFTContext";
import { useNavigate } from "react-router-dom";
import UploadToIPFS from "../../ipfs";

const OrganizeEventPage = () => {
  const { state } = useContext(EventTicketFactoryContext);
  const navigate = useNavigate();

  const uploadSymbolImageInput = useRef(null);
  const uploadPosterImageInput = useRef(null);

  const [name, setName] = useState("");
  const [eventSymbol, setEventSymbol] = useState("Select file");
  const [eventSymbolFile, setEventSymbolFile] = useState(null);
  const [eventPoster, setEventPoster] = useState("Select file");
  const [eventPosterFile, setEventPosterFile] = useState(null);
  const [price, setPrice] = useState(0);
  const [isChecked, setIsChecked] = useState(true);

  const handleSymbolUploadImage = (e) => {
    e.preventDefault();
    uploadSymbolImageInput.current.click();
  };

  const handlePosterUploadImage = (e) => {
    e.preventDefault();
    uploadPosterImageInput.current.click();
  };

  const handleSymbolFileChange = (e) => {
    setEventSymbol(e.target.files[0].name);
    setEventSymbolFile(e.target.files);
  };
  const handlePosterFileChange = (e) => {
    setEventPoster(e.target.files[0].name);
    setEventPosterFile(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !isChecked ||
      eventSymbolFile === "" ||
      name === "" ||
      eventPosterFile === ""
    ) {
      alert("Enter all details first");
      return;
    }

    try {
      // const { accounts, connectingWithSmartContract } = state;
      // console.log(accounts);
      // const cid = await UploadToIPFS(state, imageFile);
      // console.log(cid);

      // await connectingWithSmartContract.methods.registerPerson(`${accounts}`, cid, fileName, name, gender, aadhar, phyAddress, dob, contactNo).send({ from: accounts });
      // const res = await connectingWithSmartContract.methods.getPerson(`${accounts}`).call();
      // console.log(res);

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
                className={`w-full px-5 py-2 sm:rounded-md font-medium bg-gray-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white`}
                type="username"
                placeholder="Enter your name"
                onChange={(e) => setName(e.target.value)}
                value={name}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={`${styles.inputLabel}`}>
                Upload Event Symbol
              </label>
              <button
                onClick={handleSymbolUploadImage}
                className={`w-full px-5 py-2 sm:rounded-md font-medium bg-indigo-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white`}
              >
                {eventSymbol}
              </button>
              <input
                onChange={handleSymbolFileChange}
                ref={uploadSymbolImageInput}
                accept="image/*"
                className={`w-full px-5 py-2 sm:rounded-md font-medium bg-gray-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white ${styles.fileInput}`}
                type="file"
                placeholder={""}
              />
            </div>

            <div className={`${styles.inputContainer}`}>
              <label className={`${styles.inputLabel}`}>Ticket Price</label>
              <input
                className={`w-full px-5 py-2 sm:rounded-md font-medium bg-gray-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white`}
                type="number"
                placeholder="Enter ticket Price"
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={`${styles.inputLabel}`}>
                Upload Event Poster
              </label>
              <button
                onClick={handlePosterUploadImage}
                className={`w-full px-5 py-2 sm:rounded-md font-medium bg-indigo-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white`}
              >
                {eventPoster}
              </button>
              <input
                onChange={handlePosterFileChange}
                ref={uploadPosterImageInput}
                accept="image/*"
                className={`w-full px-5 py-2 sm:rounded-md font-medium bg-gray-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white ${styles.fileInput}`}
                type="file"
                placeholder={""}
              />
            </div>

            <div className="flex flex-col items-center">
              <a
                className={` w-full font-semibold shadow-sm rounded-lg py-3 bg-indigo-400 text-gray-100 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow hover:bg-indigo-600 focus:shadow-sm focus:shadow-outline mt-5`}
                onClick={handleSubmit}
                href="/"
              >
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
