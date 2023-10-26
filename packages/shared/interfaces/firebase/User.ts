import { Timestamp } from "firebase/firestore";

export interface User {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  admin: string[];
  avatarUrl: string;
  createdDate: Timestamp;
  updatedDate: Timestamp;
  language: string;
  isActive: boolean;
  projects: string[];
  activeProject?: string;
}
