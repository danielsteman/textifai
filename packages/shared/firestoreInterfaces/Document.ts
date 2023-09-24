import { Timestamp } from "firebase/firestore";

export interface Document {
  projectId: string;
  uploadedBy: string;
  fileName: string;
  fileType: string;
  author: string;
  uploadDate: Timestamp;
  creationDate: Timestamp;
  summary: string;
  topics: string;
  tags: string[];
  fileSize: number;
  wordCount: number;
  extractedText: string;
  topicText: string;
  favoritedBy: Boolean;
}
