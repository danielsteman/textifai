import React, { useContext, useEffect, useState } from "react";
import { Project } from "@shared/interfaces/firebase/Project";
import { QueryDocumentSnapshot, collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "./AuthProvider";
import LoadingScreen from "../../common/components/LoadingScreen";

interface Props {
  children: React.ReactNode;
}

interface ExtendedProject extends Project {
  uid: string;
}

export const ProjectContext = React.createContext<ExtendedProject[]>([]);

export const ProjectProvider: React.FC<Props> = ({ children }) => {
  const [projects, setProjects] = useState<ExtendedProject[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useContext(AuthContext);

  useEffect(() => {
    if (currentUser) {
      const projectsRef = collection(db, "projects");
      const projectsQuery = query(
        projectsRef,
        where("users", "array-contains", currentUser.uid)
      );

      const unsubscribe = onSnapshot(projectsQuery, (snapshot) => {
        const fetchedProjects: ExtendedProject[] = [];
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          const projectData = doc.data() as Project;
          fetchedProjects.push({ ...projectData, uid: doc.id });
        });
        setProjects(fetchedProjects);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ProjectContext.Provider value={projects}>
      {children}
    </ProjectContext.Provider>
  );
};
