import React, { useState, useContext, useRef, useEffect } from "react";
import styles from "./PurchaseTicket.module.css";
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
						<h2 className={`${styles.heading}`}>Purchase Ticket</h2>

						<div className={`${styles.inputContainer}`}>
							<label className={`${styles.inputLabel}`}>
								Name
							</label>
							<input
								className={styles.input}
								type="username"
								placeholder="Enter your name"
								onChange={(e) => setName(e.target.value)}
								value={name}
							/>
						</div>

						<div className={`${styles.inputContainer}`}>
							<label className={`${styles.inputLabel}`}>
								Contact Number
							</label>
							<input
								className={styles.input}
								type="text"
								placeholder="Enter your contact number"
								onChange={(e) => setContactNo(e.target.value)}
								value={contactNo}
							/>
						</div>

						<div className={`${styles.inputContainer}`}>
							<label className={`${styles.inputLabel}`}>
								Physical Address
							</label>
							<input
								className={styles.input}
								type="text"
								placeholder="Enter your physical address"
								onChange={(e) => setPhyAddress(e.target.value)}
								value={phyAddress}
							/>
						</div>

						<div className={`${styles.inputContainer}`}>
							<label className={`${styles.inputLabel}`}>
								Gender
							</label>
							<select
								value={gender}
								className={styles.input}
								name="genderInput"
								onChange={handleGenderChange}
							>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
								<option value="Other">Other</option>
							</select>
						</div>

						<div className={`${styles.inputContainer}`}>
							<label className={`${styles.inputLabel}`}>
								Date of Birth
							</label>
							<input
								className={styles.input}
								type="date"
								placeholder="DD/MM/YYYY"
								onChange={(e) => {
									setDOB(e.target.value);
								}}
								value={dob}
							/>
						</div>

						<div className={styles.button}>
							<a
								className={styles.anchor}
								onClick={handleSubmit}
								href="/"
							>
								<span className="ml-4">Purchase</span>
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default OrganizeEventPage;
