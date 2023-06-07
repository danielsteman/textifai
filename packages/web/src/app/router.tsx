import { createBrowserRouter } from "react-router-dom";
import Docs from "./routes/Docs";
import ErrorPage from "./routes/ErrorPage";
import Login from "./routes/Login";
import Pricing from "./routes/Pricing";
import Features from "./routes/Features";
import Root from "./routes/Root";
import PrivateRoute from "./routes/routeUtils/PrivateRoute";
import Settings from "./routes/Settings";
import Support from "./routes/Support";
import Assistant from "./routes/Assistant";
import FlexLayout from "./layouts/FlexLayout";
import Layout from "./layouts/FlexLayout";
import Upload from "./routes/Upload";
import Editor from "./routes/Editor";

export const router = createBrowserRouter([
  {
    element: <FlexLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Root />,
      },
      {
        path: "features/assistant",
        element: <Assistant />,
      },
      {
        path: "features/editor",
        element: <Editor />,
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
        path: "features",
        element: <Features />,
      },
      {
        path: "features/upload",
        element: <Upload />,
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