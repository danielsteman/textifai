import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./providers/AuthProvider";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./themes/theme";
import { router } from "./router";
import { ProjectProvider } from "./providers/ProjectProvider";
import { Provider } from "react-redux";
import { store } from "./store";
import { StripeProvider } from "./providers/StripeProvider";

if (!localStorage.getItem("chakra-ui-color-mode-default")) {
  localStorage.setItem("chakra-ui-color-mode", "dark");
  localStorage.setItem("chakra-ui-color-mode-default", "set");
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <Provider store={store}>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <StripeProvider>
          <ProjectProvider>
            <RouterProvider router={router} />
          </ProjectProvider>
        </StripeProvider>
      </AuthProvider>
    </ChakraProvider>
  </Provider>
);
