import { useContext } from "react";
import { Navigate, To } from "react-router-dom";
import { AuthContext } from "../../providers/AuthProvider";

// TODO: add a check to evaluate if user has a verified email address
// otherwise, show overlay with instructions

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
