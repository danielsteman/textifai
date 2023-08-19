import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { processFile } from "../lib/pineconeUpload"; 

const router = express.Router();

// Configure Multer for file upload handling
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload", 
  (req: Request, res: Response, next: NextFunction) => {
    // Log the headers (filtering out potential authorization headers)
    console.log('Headers:', { ...req.headers, authorization: 'REDACTED' });

    // Continue to the next middleware
    next();
  },
  upload.single('file'), 
  async (
    req: Request, 
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Access the uploaded file
      const file = req.file;

      // Check if a file was uploaded
      if (!file) {
        return res.status(400).json({ error: 'No file was uploaded' });
      }

      // Log some details about the uploaded file
      console.log('File:', {
        originalName: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });
      
      // Pass the file buffer directly to the processFile function
      await processFile(file.buffer);

      // Send a success response
      res.json({ success: true, message: 'File processed successfully' });
    } catch (error) {
      console.error('Failed to process file:', error);
      res.status(500).json({ error: 'Failed to process file' });
    }
  }
);

export default router;
