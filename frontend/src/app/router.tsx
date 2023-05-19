import { createBrowserRouter } from "react-router-dom";
import Docs from "./routes/Docs";
import ErrorPage from "./routes/ErrorPage";
import Login from "./routes/Login";
import Pricing from "./routes/Pricing";
import Products from "./routes/Products";
import Root from "./routes/Root";
import PrivateRoute from "./routes/routeUtils/PrivateRoute";
import Settings from "./routes/Settings";
import Support from "./routes/Support";
import Assistant from "./routes/Assistant";
import LandingPageFlexLayout from "./layouts/LandingPageFlexLayout";
import LandingPageLayout from "./layouts/LandingPageLayout";

export const router = createBrowserRouter([
  {
    element: <LandingPageFlexLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Root />,
      },
      {
        path: "products/textifai",
        element: <Assistant />,
      },
    ],
  },
  {
    element: <LandingPageLayout />,
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
