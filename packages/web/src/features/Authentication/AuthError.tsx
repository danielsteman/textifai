import { Alert, AlertIcon } from "@chakra-ui/react";
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
          We couldn't find this email address.
        </Alert>
      );
    case "auth/invalid-email":
      return (
        <Alert status="error">
          <AlertIcon />
          The email address you used is invalid.
        </Alert>
      );
    case "auth/email-already-exists":
      return (
        <Alert status="error">
          <AlertIcon />
          The provided email is already in use by an existing user.
        </Alert>
      );
    case "auth/email-already-in-use":
      return (
        <Alert status="error">
          <AlertIcon />
          The provided email is already in use by an existing user.
        </Alert>
      );
    case "auth/invalid-password":
      return (
        <Alert status="error">
          <AlertIcon />
          The password must be a string with at least six characters.
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
