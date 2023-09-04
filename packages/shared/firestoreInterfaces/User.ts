export interface User {
  userId: string;
  avatarUrl: string;
  createdDate: Date;
  updatedDate: Date;
  language: string;
  isActive: boolean;
  adminForProjects: string[];
  projects: string[];
}
