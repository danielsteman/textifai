import React, { useEffect, useState } from "react";
import { User as FirebaseUser } from "firebase/auth";
import { auth } from "../config/firebase";
import { Project } from "@shared/firestoreInterfaces/Project";
import { Timestamp } from "firebase/firestore";

interface Props {
  children: React.ReactNode;
}

export const ProjectContext = React.createContext<Project | null>(null);

export const ProjectProvider: React.FC<Props> = ({ children }) => {
  const [project, setProject] = useState<Project | null>(null);

  useEffect(() => {
    // fetch project
    const project: Project = {
      name: "6969696996",
      description: "",
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
