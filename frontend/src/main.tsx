import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./providers/AuthProvider";
import ErrorPage from "./routes/ErrorPage";
import Login from "./routes/Login";
import Root from "./routes/Root";
import SignUp from "./routes/SignUp";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./themes/theme";
import Header from "./layouts/Header";
import Account from "./routes/Account";
import Pricing from "./routes/Pricing";
import Support from "./routes/Support";
import Docs from "./routes/Docs";
import Products from "./routes/Products";
import PrivateRoute from "./routes/routeUtils/PrivateRoute";

const router = createBrowserRouter([
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
        path: "account",
        element: (
          <PrivateRoute>
            <Account />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
