import { Timestamp } from "firebase/firestore";

export interface Message {
  conversationId: string;
  creationDate: Timestamp;
  variant: "user" | "agent";
  messageBody: string;
  parentMessageId?: string;
}
