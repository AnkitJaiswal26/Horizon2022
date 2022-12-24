import logo from "./logo.svg";
import "./App.css";
import { useContext, useState } from "react";
// import { EventTicketFactoryProvider } from "./Context/NFTContext";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import OrganizeEventPage from "./pages/OrganizeEventPage/OrganizeEventPage";
import ExploreEvents from "./pages/ExploreEvents/ExploreEvents";
import EventInfoPage from "./pages/EventInfoPage/EventInfoPage";
import PurchaseTicket from "./pages/PurchaseTicket/PurchaseTicket";
import Dashboard from "./pages/Dashboard/Dashboard";
import Resell from "./pages/Resell/Resell";
import ResellForm from "./pages/ResellForm/ResellForm";
import PurchaseResellTicket from "./pages/PurchaseResellTicket/PurchaseResellTicket";

function App() {
	// const {myname} = useContext(NFTTicketContext);
	// const state = useContext(EventTicketFactoryContext);
	// console.log(state);
	//   const { checkIfWalletConnected, connectWallet, currentAccount, connectingWithSmartContract, myname } =
	//     state;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/organizeevent",
      element: <OrganizeEventPage />,
    },
    {
      path: "/events",
      element: <ExploreEvents />,
    },
    {
      path: "/eventInfo/:address",
      element: <EventInfoPage />,
    },
    {
      path: "/purchaseticket",
      element: <PurchaseTicket />,
    },
    {
      path: "/purchaseresellticket",
      element: <PurchaseResellTicket />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
    },
    {
      path: "/resell",
      element: <Resell />,
    },
    {
      path: "/resellform",
      element: <ResellForm />,
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
    // <EventTicketFactoryProvider>
    <RouterProvider router={router}></RouterProvider>
    // </EventTicketFactoryProvider>
  );
}

export default App;
