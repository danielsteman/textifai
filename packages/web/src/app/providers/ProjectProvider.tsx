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

interface Props {
  children: React.ReactNode;
}

export const ProjectContext = React.createContext<Project[]>([]);

export const ProjectProvider: React.FC<Props> = ({ children }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const currentUser = useContext(AuthContext);

  useEffect(() => {
    const projectsRef = collection(db, "projects");
    const projectsQuery = query(
      projectsRef,
      where("users", "array-contains", currentUser?.uid)
    );

    const getProjects = async () => {
      const projectsSnapshot = await getDocs(projectsQuery);
      projectsSnapshot.docs.map((project: QueryDocumentSnapshot) => {
        const projectData = project.data() as Project;
        setProjects([...projects, projectData]);
      });
    };

    getProjects();
  }, []);

  return (
    <ProjectContext.Provider value={projects}>
      {children}
    </ProjectContext.Provider>
  );
};
