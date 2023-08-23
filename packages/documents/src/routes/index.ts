import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { processFile } from "../lib/pineconeUpload";
import pdfParse from "pdf-parse";

const router = express.Router();

// Configure Multer for file upload handling
const upload = multer({ storage: multer.memoryStorage() });

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
      // Access the uploaded file
      console.log("Request received", req.file);
      const pdfBuffer: Buffer | undefined = req.file?.buffer;

      if (!pdfBuffer) {
        res.status(400).json({ error: "No PDF file uploaded" });
        return;
      }

      const text = await extractTextFromPDF(pdfBuffer)

      // Pass the file buffer directly to the processFile function
      await processFile(text);

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
