import pdfParse from "pdf-parse";
import { PDFDocument } from "pdf-lib";
import { Timestamp } from 'firebase/firestore';
import { addDoc, collection } from "firebase/firestore";

  interface PdfMetadata {
    fileName: string;
    author: string;
    creationDate: Date;
    fileSize: number;
    extractedText: string;
    topicText: string;
    wordCount: number;
    favoritedBy: Boolean;
}

function countWords(text: string): number {
    const words = text.split(/\s+/).filter(Boolean);
    return words.length;
  }

function getFirstNWords(text: string, n: number): string {
    const words = text.split(/\s+/).filter(Boolean);
    return words.slice(0, n).join(" ");
}

export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
    try {
        const rawData = await pdfParse(pdfBuffer);
        return rawData.text;
    } catch (error) {
        console.error("Failed to read document:", error);
        throw new Error("Failed to read document");
    }
}

export async function extractMetadataFromPDF (
    pdfBuffer: Buffer, 
    text: string, 
): Promise<PdfMetadata> {
    try {
        const pdfDoc = await PDFDocument.load(pdfBuffer);
        
        return {
            fileName: pdfDoc.getTitle() || "",
            author: pdfDoc.getAuthor() || "",
            creationDate: pdfDoc.getCreationDate() || new Date(),
            fileSize: parseFloat((pdfBuffer.length / (1024 * 1024)).toFixed(2)),
            extractedText: text, 
            topicText: getFirstNWords(text, 250),
            wordCount: countWords(text),
            favoritedBy: false,
        };

    } catch (error) {
        console.error("Failed to read document metadata:", error);
        throw new Error("Failed to read document metadata");
    }
}