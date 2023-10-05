import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { ProjectContext } from "../../providers/ProjectProvider";

interface Props {
  children: React.ReactNode;
  to?: string;
}

const ProjectRoute: React.FC<Props> = ({ children, to = "/features/onboarding" }) => {
  const projects = useContext(ProjectContext);
  const activeProject = projects.find(project => project.active);

  const noValidProject = projects.length === 0 || (activeProject && activeProject.name === "⚠️ Project title not found");

  if (noValidProject) {
    return <Navigate to={to} />;
  } else {
    return <>{children}</>;
  }
};

export default ProjectRoute;
