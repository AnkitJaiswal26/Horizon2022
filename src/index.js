import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { NFTTicketProvider } from "./Context/NFTContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<React.StrictMode>
		<NFTTicketProvider>
			<App />
		</NFTTicketProvider>
	</React.StrictMode>
);
