import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./Home";

const router = createBrowserRouter([
	{
		path: "/:area/:id",
		element: <Home />,
	},
	{
		path: "/:area",
		element: <Home />,
	},
	{
		path: "/",
		element: <Home />,
	},
]);

export function App() {
	return (
		<React.StrictMode>
			<RouterProvider router={router} />
		</React.StrictMode>
	);
}
