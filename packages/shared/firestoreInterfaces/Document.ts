import { Timestamp } from "firebase/firestore";

export interface Document {
  projectId: string;
  uploadedBy: string;
  fileName: string;
  author: string;
  creationDate: Timestamp;
  summary: string;
  topics: string[];
  tags: string[];
  fileSize: number;
  wordCount: number;
  extractedText: string;
  favoritedBy: string[];
}
