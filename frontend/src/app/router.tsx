import { createBrowserRouter } from "react-router-dom";
import Layout from "./layouts/Layout";
import Docs from "./routes/Docs";
import ErrorPage from "./routes/ErrorPage";
import Login from "./routes/Login";
import Pricing from "./routes/Pricing";
import Products from "./routes/Products";
import Root from "./routes/Root";
import PrivateRoute from "./routes/routeUtils/PrivateRoute";
import Settings from "./routes/Settings";
import Support from "./routes/Support";
import Product from "./routes/Product";
import LandingPageLayout from "./layouts/LandingPageLayout";

export const router = createBrowserRouter([
  {
    element: <LandingPageLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Root />,
      },
    ],
  },
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <Login />,
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
        children: [
          {
            path: "*",
            element: <Product />,
          },
        ],
      },
      {
        path: "settings",
        element: (
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
