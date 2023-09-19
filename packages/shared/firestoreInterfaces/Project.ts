import { Timestamp } from "firebase/firestore";

export interface Project {
  name: string;
  description: string;
  industry: string;
  users: string[];
  creationDate: Timestamp;
}
