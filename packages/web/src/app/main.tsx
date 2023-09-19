import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./providers/AuthProvider";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./themes/theme";
import { router } from "./router";
import { worker } from "./mocks/browser";
import { ProjectProvider } from "./providers/ProjectProvider";

// if (process.env.NODE_ENV === "development") {
//   worker.start();
// }

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <ProjectProvider>
          <RouterProvider router={router} />
        </ProjectProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>
);
