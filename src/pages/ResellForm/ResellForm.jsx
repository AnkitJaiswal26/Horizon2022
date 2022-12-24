import React, { useState, useContext, useRef, useEffect } from "react";
import styles from "./ResellForm.module.css";
import { EventTicketFactoryContext } from "../../Context/NFTContext";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";

const OrganizeEventPage = () => {
	const {
		uploadJSONToIPFS,
		onPurchaseTicket,
		fetchEventDetails,
		getAllCustomers,
	} = useContext(EventTicketFactoryContext);

	const [eventAddress, setEventAddress] = useState("");

	useEffect(() => {
		const onReload = () => {
			setEventAddress(window.location.pathname.split("/")[2]);
		};

		onReload();
	}, []);

	const navigate = useNavigate();

	const uploadSymbolImageInput = useRef(null);
	const uploadPosterImageInput = useRef(null);

	const [name, setName] = useState("");
	const [dob, setDOB] = useState("");
	const [contactNo, setContactNo] = useState("");
	const [gender, setGender] = useState("Male");
	const [phyAddress, setPhyAddress] = useState("");
	const [isChecked, setIsChecked] = useState(true);

	const handleGenderChange = (e) => {
		setGender(e.target.value);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			!isChecked ||
			name === "" ||
			contactNo === "" ||
			gender === "" ||
			phyAddress === "" ||
			dob === ""
		) {
			alert("Enter all details first");
			return;
		}

		try {
			const eventData = await fetchEventDetails(eventAddress);
			const jsonData = {
				name,
				dob,
				contactNo,
				gender,
				phyAddress,
			};
			console.log("In the function...");
			const cid = await uploadJSONToIPFS(jsonData);
			console.log(cid);

			await onPurchaseTicket(
				eventData.marketplace,
				ethers.utils.formatUnits(
					eventData.ticketPrice._hex.toString(),
					"ether"
				),
				cid
			);
			console.log("hello");
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
				<div className={`${styles.formBox}`}>
					<form onSubmit={handleSubmit}>
						<h2 className={`${styles.heading}`}>Resell Ticket</h2>
						<div className={`${styles.inputContainer}`}>
							<label className={`${styles.inputLabel}`}>
								Select Ticket ID
							</label>
							<select
								value={gender}
								className={styles.input}
								name="genderInput"
								onChange={handleGenderChange}
							>
								<option value="Other">Other</option>
							</select>
						</div>

						<div className={styles.button}>
							<a
								className={styles.anchor}
								onClick={handleSubmit}
								href="/"
							>
								<span className="ml-4">Resell</span>
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default OrganizeEventPage;
