// Extend errorMap to map a message to a Firebase error
// TODO: convert error to something that's user friendly (use table: https://firebase.google.com/docs/auth/admin/errors)
import { Box, Link } from "@chakra-ui/react";
import React from "react";

interface Props {
  code: string | undefined;
}

const AuthError: React.FC<Props> = (props) => {
  if (props.code === "auth/user-not-found") {
    return (
      <Box>
        We couldn't find this email. Would you like to{" "}
        <Link>sign up with this email address?</Link>{" "}
      </Box>
    );
  } else {
    throw new Error("No message available for this Firebase error code");
  }
};

export default AuthError;
