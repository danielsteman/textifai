import { Timestamp } from "firebase/firestore";

export interface Conversation {
  userId: string;
  projectId: string;
  creationDate: Timestamp;
  updatedDate: Timestamp;
}
