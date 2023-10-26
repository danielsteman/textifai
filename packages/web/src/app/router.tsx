import { createBrowserRouter } from "react-router-dom";
import Docs from "./routes/Docs";
import ErrorPage from "./routes/ErrorPage";
import Login from "./routes/Login";
import Pricing from "./routes/Pricing";
import LandingPage from "./routes/LandingPage";
import PrivateRoute from "./routes/routeUtils/PrivateRoute";
import ProjectRoute from "./routes/routeUtils/ProjectRoute";
import Support from "./routes/Support";
import Assistant from "./routes/Assistant";
import Layout from "./layouts/Layout";
import Upload from "./routes/Upload";
import Editor from "./routes/Editor";
import WorkspacePage from "./routes/WorkspacePage";
import CreateProject from "./routes/CreateProject";
import PdfViewer from "./routes/PdfViewer";
import AccountSettings from "./routes/AccountSettings";
import EmailVerification from "./routes/VerifyEmail";
import Completion from "src/features/Checkout/Completion";

export const router = createBrowserRouter([
  {
    path: "/features/workspace",
    element: (
      <PrivateRoute>
        <ProjectRoute>
          <WorkspacePage />
        </ProjectRoute>
      </PrivateRoute>
    ),
  },
  {
    path: "settings",
    element: (
      <PrivateRoute>
        <AccountSettings />
      </PrivateRoute>
    ),
  },
  {
    path: "/features/onboarding",
    element: (
      <PrivateRoute>
        <CreateProject />
      </PrivateRoute>
    ),
  },
  {
    path: "/email-verification",
    element: (
      <PrivateRoute>
        <EmailVerification />
      </PrivateRoute>
    ),
  },
  {
    path: "/payment-completion",
    element: (
      <PrivateRoute>
        <Completion />
      </PrivateRoute>
    ),
  },
  {
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
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
    ],
  },
]);
