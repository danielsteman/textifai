import { Project } from "@shared/interfaces/firebase/Project";

export const getCurrentProjectTitle = (userProjects: Project[]) => {
  const projectTitle = userProjects.filter(
    (project) => project.active === true
  );
  if (projectTitle && projectTitle.length > 0) {
    return projectTitle[0].name;
  } else {
    return "⚠️ Project title not found";
  }
};
