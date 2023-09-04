export interface Message {
  messageId: string;
  conversationId: string;
  creationDate: Date;
  variant: "user" | "agent";
  messageBody: string;
  parentMessageId?: string;
}
