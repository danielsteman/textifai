import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { processFile } from "../lib/pineconeUpload"; 

const router = express.Router();

// Configure Multer for file upload handling
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/upload", 
  upload.single('file'), 
  async (
    req: Request, 
    res: Response,
    next: NextFunction
  ) => {
    try {
      // Access the uploaded file
      console.log('Request received', req.file);  
      const file = req.file;

      // Check if a file was uploaded
      if (!file) {
        return res.status(400).json({error: req.body}) // res.status(400).json({ error: 'No file found in request:', req });
      }
      
      // Pass the file buffer directly to the processFile function
       await processFile( file.buffer );

      // Send a success response
      res.json({ success: true, message: 'File processed successfully' });
    } catch (error) {
      next(error)
      console.error('Failed to process file:', error);
      res.status(500).json({ error: 'Failed to process file' });
    }
  }
);

export default router;
