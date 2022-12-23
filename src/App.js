import logo from "./logo.svg";
import "./App.css";
import { useContext } from "react";
import { EventTicketFactoryContext } from "./Context/NFTContext";

function App() {
	const { myname, createEvent } = useContext(EventTicketFactoryContext);
	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.js</code> and save to reload.
				</p>
				<a
					className="App-link"
					href="https://reactjs.org"
					target="_blank"
					rel="noopener noreferrer"
				>
					Learn React {myname}
				</a>
				<button
					onClick={(e) => {
						e.preventDefault();
						createEvent(
							"My  Event",
							"MNEE",
							"imageHash",
							0.01,
							100
						);
					}}
				>
					Click Me and open your console and debug me
				</button>
			</header>
		</div>
	);
}

export default App;
