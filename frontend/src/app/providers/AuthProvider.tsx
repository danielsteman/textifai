import React, { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import auth from "../config/firebase";

interface Props {
  children: React.ReactNode;
}

export const AuthContext = React.createContext<FirebaseUser | null>(null);

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      return setUser(user);
    });
  }, []);

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
