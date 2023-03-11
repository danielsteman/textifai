import { Heading } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";

const Account = () => {
  const [isValidToken, setIsValidToken] = useState<boolean | null>(null);
  const currentUser = useContext(AuthContext);
  const { pathname } = useLocation();

  function checkToken() {
    return true;
  }

  useEffect(() => {
    setIsValidToken(!!checkToken());
  }, [pathname]);

  console.log(currentUser)

  return isValidToken ? <Heading>Account details</Heading> : <Navigate to="/" />
}

export default Account;