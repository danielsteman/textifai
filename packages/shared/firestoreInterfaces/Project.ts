import { Timestamp } from "firebase/firestore";

export interface Project {
  projectId?: string;
  name: string;
  description: string;
  industry: string;
  users: string[];
  creationDate: Timestamp;
}
