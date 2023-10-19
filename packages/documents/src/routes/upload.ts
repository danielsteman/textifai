import express from "express";
import multer from "multer";
import { documentController } from "../controllers/documentController";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post("/upload", upload.single("file"), documentController);

export default router;
