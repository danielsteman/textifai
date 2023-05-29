import { Alert, AlertIcon, Link } from "@chakra-ui/react";
import React from "react";

interface Props {
  code: string;
}

const AuthError: React.FC<Props> = (props) => {
  switch (props.code) {
    case "auth/user-not-found":
      return (
        <Alert status="warning">
          <AlertIcon />
          We couldn't find this email address
        </Alert>
      );
    case "auth/invalid-email":
      return (
        <Alert status="error">
          <AlertIcon />
          The email address you used is invalid
        </Alert>
      );
    default:
      console.warn(
        `No message available for "${props.code}" Firebase error code`
      );
      return null;
  }
};

export default AuthError;
