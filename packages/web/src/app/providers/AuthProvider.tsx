import React, { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth } from "../config/firebase";
import { Spinner } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

export const AuthContext = React.createContext<FirebaseUser | null>(null);

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      console.log(user);
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
