import { createBrowserRouter } from "react-router-dom";
import Docs from "./routes/Docs";
import ErrorPage from "./routes/ErrorPage";
import Login from "./routes/Login";
import Pricing from "./routes/Pricing";
import Root from "./routes/Root";
import PrivateRoute from "./routes/routeUtils/PrivateRoute";
import Support from "./routes/Support";
import Assistant from "./routes/Assistant";
import FlexLayout from "./layouts/FlexLayout";
import Layout from "./layouts/FlexLayout";
import Upload from "./routes/Upload";
import Editor from "./routes/Editor";
import WorkspacePage from "./routes/WorkspacePage";
import CreateProject from "./routes/CreateProject";
import PdfViewer from "./routes/PdfViewer";
import AccountSettings from "./routes/AccountSettings";

export const router = createBrowserRouter([
  {
    element: <WorkspacePage />,
    path: "/features/workspace",
  },
  {
    path: "/features/onboarding",
    element: <CreateProject />,
  },
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
        element: (
          <PrivateRoute>
            <Assistant />
          </PrivateRoute>
        ),
      },
      {
        path: "features/editor",
        element: (
          <PrivateRoute>
            <Editor />
          </PrivateRoute>
        ),
      },
      {
        path: "features/upload",
        element: (
          <PrivateRoute>
            <Upload />
          </PrivateRoute>
        ),
      },
      {
        path: "features/pdfviewer",
        element: (
          <PrivateRoute>
            <PdfViewer />
          </PrivateRoute>
        ),
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
        path: "settings",
        element: (
          <PrivateRoute>
            <AccountSettings />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
