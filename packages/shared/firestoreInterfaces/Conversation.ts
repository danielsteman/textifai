import { Timestamp } from "firebase/firestore";

export interface Conversation {
  conversationId: string;
  userId: string;
  projectId: string;
  creationDate: Timestamp;
  updatedDate: Timestamp;
}
