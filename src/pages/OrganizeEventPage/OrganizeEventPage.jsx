import React, { useState, useContext, useRef } from "react";
import styles from "./OrganizeEventPage.module.css";
import { EventTicketFactoryContext } from "../../Context/NFTContext"
import { useNavigate } from "react-router-dom";
import UploadToIPFS from "../../ipfs";

const OrganizeEventPage = () => {
	const { state } = useContext(EventTicketFactoryContext);
	const navigate = useNavigate();

	const uploadImageInput = useRef(null);

	const [name, setName] = useState("");
	const [fileName, setFileName] = useState("Select file");
	const [imageFile, setImageFile] = useState(null);
	const [aadhar, setAadhar] = useState("");
	const [dob, setDOB] = useState("");
	const [contactNo, setContactNo] = useState("");
	const [gender, setGender] = useState("Male");
	const [phyAddress, setPhyAddress] = useState("");
	const [isChecked, setIsChecked] = useState(true);

	const handleUploadImage = (e) => {
		e.preventDefault();
		uploadImageInput.current.click();
	};

	const handleFileChange = (e) => {
		setFileName(e.target.files[0].name);
		setImageFile(e.target.files);
	};

	const handleGenderChange = (e) => {
		setGender(e.target.value);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (
			!isChecked ||
			fileName === "" ||
			name === "" ||
			aadhar === "" ||
			contactNo === "" ||
			gender === "" ||
			phyAddress === "" ||
			dob === ""
		) {
			alert("Enter all details first");
			return;
		}

		try {
			const { accounts, connectingWithSmartContract } = state;
			console.log(accounts);
			const cid = await UploadToIPFS(state, imageFile);
			console.log(cid);

            await connectingWithSmartContract.methods.registerPerson(`${accounts}`, cid, fileName, name, gender, aadhar, phyAddress, dob, contactNo).send({ from: accounts });
            const res = await connectingWithSmartContract.methods.getPerson(`${accounts}`).call();
            console.log(res);

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
					<h2>User Registration</h2>
				</div>
				<div className={`${styles.formBox}`}>
					<form onSubmit={handleSubmit}>
						<h2 className={`${styles.heading}`}>Register</h2>

						<div className={`${styles.inputContainer}`}>
							<label className={`${styles.inputLabel}`}>
								Name
							</label>
							<input
								className={`w-full px-5 py-2 sm:rounded-md font-medium bg-gray-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white`}
								type="username"
								placeholder="Enter your name"
								onChange={(e) => setName(e.target.value)}
								value={name}
							/>
						</div>
						<div className={`${styles.inputContainer}`}>
							<label className={`${styles.inputLabel}`}>
								Aadhaar Number
							</label>
							<input
								className={`w-full px-5 py-2 sm:rounded-md font-medium bg-gray-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white`}
								type="text"
								placeholder="Enter your aadhaar Number"
								onChange={(e) => setAadhar(e.target.value)}
								value={aadhar}
							/>
						</div>

						<div className={`${styles.inputContainer}`}>
							<label className={`${styles.inputLabel}`}>
								Contact Number
							</label>
							<input
								className={`w-full px-5 py-2 sm:rounded-md font-medium bg-gray-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white`}
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
								className={`w-full px-5 py-2 sm:rounded-md font-medium bg-gray-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white`}
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
								className={`w-full px-5 py-2 sm:rounded-md font-medium bg-gray-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white`}
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
								className={`w-full px-5 py-2 sm:rounded-md font-medium bg-gray-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white`}
								type="date"
								placeholder="DD/MM/YYYY"
								onChange={(e) => {
									setDOB(e.target.value);
								}}
								value={dob}
							/>
						</div>

						<div className={styles.inputGroup}>
							<label className={`${styles.inputLabel}`}>
								Upload Image Document
							</label>
							<button
								onClick={handleUploadImage}
								className={`w-full px-5 py-2 sm:rounded-md font-medium bg-indigo-100 placeholder-gray-500 text-sm border focus:outline-none focus:border-gray-400 focus:bg-white`}
							>
								{fileName}
							</button>
							<input
								onChange={handleFileChange}
								ref={uploadImageInput}
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
								<span className="ml-4">Register</span>
							</a>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default OrganizeEventPage;
