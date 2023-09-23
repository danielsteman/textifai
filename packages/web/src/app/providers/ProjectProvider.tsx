import React, { useEffect, useState } from "react";
import { Project } from "@shared/firestoreInterfaces/Project";
import { Timestamp, collection } from "firebase/firestore";
import { db } from "../config/firebase";

interface Props {
  children: React.ReactNode;
}

export const ProjectContext = React.createContext<Project | null>(null);

export const ProjectProvider: React.FC<Props> = ({ children }) => {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    const projectsRef = collection(db, "projects");
    // fetch project
    const project: Project = {
      name: "this is an example of a project object but should be fetched from firestore",
      description: "alvast bedankt",
      industry: "",
      users: [],
      creationDate: Timestamp.fromDate(new Date()),
    };
    setProject(project);
  }, []);

  return (
    <ProjectContext.Provider value={project}>
      {children}
    </ProjectContext.Provider>
  );
};
