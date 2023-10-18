import React, { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth } from "../config/firebase";
import LoadingScreen from "../../common/components/LoadingScreen";

interface Props {
  children: React.ReactNode;
}

export const AuthContext = React.createContext<FirebaseUser | null>(null);

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
