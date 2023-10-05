import React, { useContext, useEffect, useState } from "react";
import { Project } from "@shared/firestoreInterfaces/Project";
import {
  QueryDocumentSnapshot,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "./AuthProvider";
import { Spinner } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
}

export const ProjectContext = React.createContext<Project[]>([]);

export const ProjectProvider: React.FC<Props> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      const projectsRef = collection(db, "projects");
      const projectsQuery = query(
        projectsRef,
        where("users", "array-contains", currentUser.uid)
      );

      // Use Firestore's real-time listener to listen for changes in the query results
      const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
        const fetchedProjects: Project[] = [];
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          fetchedProjects.push(doc.data() as Project);
        });
        setProjects(fetchedProjects);
        setLoading(false);
      });

      // Detach the listener when the component unmounts
      return () => unsubscribe();

    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <ProjectContext.Provider value={projects}>
      {children}
    </ProjectContext.Provider>
  );
};
