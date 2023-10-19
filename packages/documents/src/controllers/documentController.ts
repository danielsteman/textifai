import { NextFunction, Request, Response } from "express";
import { processFile } from "../lib/pineconeUpload";
import { extractTextFromPDF, extractMetadataFromPDF } from "../utils/pdfUtils";
import path from "path";

export const documentController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const fileBuffer = Buffer.from(req.file.buffer);
    const text = await extractTextFromPDF(fileBuffer);
    const fileName = req.file.originalname;
    const fileType = path.extname(fileName).slice(1);
    const user = req.body.userId;

    const metadata = await extractMetadataFromPDF(
      fileBuffer,
      text,
      fileName,
      fileType
    );

    await processFile(
      text,
      process.env.PINECONE_API_KEY || "",
      process.env.PINECONE_ENV || "",
      process.env.PINECONE_INDEX || "",
      user,
      fileName
    );

    res.json({
      success: true,
      message: "File processed successfully",
      metadata: metadata,
    });
  } catch (error) {
    next(error);
    console.error("Failed to process file:", error);
    res.status(500).json({ error: "Failed to process file" });
  }
};
