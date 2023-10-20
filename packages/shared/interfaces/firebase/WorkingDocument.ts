import { Timestamp } from "firebase/firestore";

export interface WorkingDocument {
  projectId: string;
  name: string;
  creationDate: Timestamp;
  modifiedDate: Timestamp;
  users: string[];
  content: string;
}