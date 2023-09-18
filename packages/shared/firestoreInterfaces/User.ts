import { Timestamp } from "firebase/firestore";

export interface User {
  firstName: string;
  lastName: string;
  admin: string[];
  avatarUrl: string;
  createdDate: Timestamp;
  updatedDate: Timestamp;
  language: string;
  isActive: boolean;
  projects: string[];
}
