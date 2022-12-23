import logo from "./logo.svg";
import "./App.css";
import { useContext, useState } from "react";
import { NFTTicketContext } from "./Context/NFTContext";
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import OrganizeEventPage from "./pages/OrganizeEventPage/OrganizeEventPage";

function App() {
  // const {myname} = useContext(NFTTicketContext);
  const state = useContext(NFTTicketContext);
  console.log(state);
  const { checkIfWalletConnected, connectWallet, currentAccount, connectingWithSmartContract, myname } =
    state;

  const router = createBrowserRouter([
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/organizeevent",
      element: <OrganizeEventPage/>
    }
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
    <NFTTicketContext.Provider value={{ state }}>
      <RouterProvider router={router}></RouterProvider>
    </NFTTicketContext.Provider>
  );
}

export default App;
