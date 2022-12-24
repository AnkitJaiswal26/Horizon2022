import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./pages/Home/HomePage";
import OrganizeEventPage from "./pages/OrganizeEventPage/OrganizeEventPage";
import ExploreEvents from "./pages/ExploreEvents/ExploreEvents";
import EventInfoPage from "./pages/EventInfoPage/EventInfoPage";
import PurchaseTicket from "./pages/PurchaseTicket/PurchaseTicket";
import Dashboard from "./pages/Dashboard/Dashboard";
import Resell from "./pages/Resell/Resell";
import PurchaseResellTicket from "./pages/PurchaseResellTicket/PurchaseResellTicket";
import ExploreMyEvents from "./pages/ExploreMyEvents/ExploreMyEvents";
import MyEventInfoPage from "./pages/MyEventInfoPage/MyEventInfoPage";

function App() {
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
			path: "/purchaseresellticket/:marketplace/:ticketId",
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
			path: "/myevents",
			element: <ExploreMyEvents />,
		},
		{
			path: "/myevents/eventInfo/:address",
			element: <MyEventInfoPage />,
		},
	]);
	return <RouterProvider router={router}></RouterProvider>;
}

export default App;
