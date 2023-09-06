import { Timestamp } from "firebase/firestore";

export interface User {
  userId: string;
  avatarUrl: string;
  createdDate: Timestamp;
  updatedDate: Timestamp;
  language: string;
  isActive: boolean;
  adminForProjects: string[];
  projects: string[];
}
