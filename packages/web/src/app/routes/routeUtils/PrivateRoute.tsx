import { useContext, useEffect, useState } from "react";
import { Navigate, To } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";
import { Spinner } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  to?: To;
}

const PrivateRoute: React.FC<Props> = ({ children, to = "/" }) => {
  const currentUser = useContext(AuthContext);

  if (!currentUser) {
    return <Navigate to={to} />;
  } else {
    return <>{children}</>;
  }
};

export default PrivateRoute;
