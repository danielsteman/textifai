import { NextFunction, Request, Response } from "express";
import processText from "../lib/processText";
import { extractTextFromPDF, extractMetadataFromPDF } from "../utils/pdfUtils";
import path from "path";
import { initializePineconeClient } from "../lib/initializeClient";

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

    const index = await initializePineconeClient();

    console.log(`index received by controller: ${index}`);

    await processText(index, text, user, fileName);

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
