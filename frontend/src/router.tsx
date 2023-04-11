import { createBrowserRouter } from "react-router-dom";
import Header from "./layouts/Header";
import Docs from "./routes/Docs";
import ErrorPage from "./routes/ErrorPage";
import Login from "./routes/Login";
import Pricing from "./routes/Pricing";
import Products from "./routes/Products";
import Root from "./routes/Root";
import PrivateRoute from "./routes/routeUtils/PrivateRoute";
import Settings from "./routes/Settings";
import SignUp from "./routes/SignUp";
import Support from "./routes/Support";

export const router = createBrowserRouter([
  {
    element: <Header />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Root />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <SignUp />,
      },
      {
        path: "pricing",
        element: <Pricing />,
      },
      {
        path: "support",
        element: <Support />,
      },
      {
        path: "docs",
        element: <Docs />,
      },
      {
        path: "products",
        element: <Products />,
      },
      {
        path: "settings",
        element: (
          // <PrivateRoute>
          <Settings />
          // </PrivateRoute>
        ),
      },
    ],
  },
]);
