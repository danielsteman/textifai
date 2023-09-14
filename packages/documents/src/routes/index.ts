import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { processFile } from "../lib/pineconeUpload";
import pdfParse from "pdf-parse";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../.env.local");
dotenv.config({ path: envPath });

const router = express.Router();

// Configure Multer for file upload handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const rawData = await pdfParse(pdfBuffer);
    return rawData.text;
  } catch (error) {
    console.error("Failed to read document:", error);
    throw new Error("Failed to read document");
  }
}

router.post(
  "/upload",
  upload.single("file"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      // Read file and extract text
      const fileBuffer = Buffer.from(req.file.buffer);
      const text = await extractTextFromPDF(fileBuffer);

      // Pass text to the processFile for chunking and embedding
      await processFile(
        text,
        process.env.PINECONE_API_KEY || "",
        process.env.PINECONE_ENV || "",
        process.env.PINECONE_INDEX || ""
      );

      // Send a success response
      res.json({ success: true, message: "File processed successfully" });
    } catch (error) {
      next(error);
      console.error("Failed to process file:", error);
      res.status(500).json({ error: "Failed to process file" });
    }
  }
);

export default router;
