import "./App.css";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import RegisterPersonPage from "./pages/RegisterPersonPage/RegisterPersonPage";
import ExploreEvents from "./pages/ExploreEvents/ExploreEvents";

function App() {
	// const {myname} = useContext(NFTTicketContext);
	// const state = useContext(NFTTicketContext);
	// console.log(state);
	// const {
	// 	checkIfWalletConnected,
	// 	connectWallet,
	// 	currentAccount,
	// 	connectingWithSmartContract,
	// 	myname,
	// } = state;

	const router = createBrowserRouter([
		{
			path: "/",
			element: <HomePage />,
		},
		{
			path: "/registerperson",
			element: <RegisterPersonPage />,
		},
		{
			path: "/events",
			element: <ExploreEvents />,
		},
	]);
	return (
		// <div className="App">
		//   <header className="App-header">
		//     <img src={logo} className="App-logo" alt="logo" />
		//     <p>
		//       Edit <code>src/App.js</code> and save to reload.
		//     </p>
		//     <a
		//       className="App-link"
		//       href="https://reactjs.org"
		//       target="_blank"
		//       rel="noopener noreferrer"
		//     >
		//       Learn React {myname}
		//     </a>
		//   </header>
		// </div>
		<RouterProvider router={router}></RouterProvider>
	);
}

export default App;
