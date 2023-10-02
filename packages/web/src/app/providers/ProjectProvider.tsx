import React, { useContext, useEffect, useState } from "react";
import { Project } from "@shared/firestoreInterfaces/Project";
import {
  QueryDocumentSnapshot,
  collection,
  getDocs,
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

      const getProjects = async () => {
        const projectsSnapshot = await getDocs(projectsQuery);
        projectsSnapshot.docs.map((project: QueryDocumentSnapshot) => {
          const projectData = project.data() as Project;
          setProjects([...projects, projectData]);
        });
      };

      getProjects();
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <ProjectContext.Provider value={projects}>
      {children}
    </ProjectContext.Provider>
  );
};
