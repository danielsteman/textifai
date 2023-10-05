import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import generalQaHandler from "../handlers/generalQaHandler"; 
import regenerateHandler from "../handlers/regenerateHandler"; 
import pdfQaHandler from "../handlers/pdfqaHandler";

const router = express.Router();

const envPath = path.resolve(__dirname, "../../../.env.local");
dotenv.config({ path: envPath });

router.post("/ask", async (req: Request, res: Response, next: NextFunction) => {
    const prompt = req.body.prompt;
    const conversationHistory = req.body.history;
    const option = req.body.option;
    const files = req.body.files;
    const userId = req.body.userId;

    try {
        switch (option) {
            case "regenerate":
                const regenerateAnswer = await regenerateHandler(prompt);
                res.json(regenerateAnswer);
                break;
            case "pdfqa":
                const pdfQaAnswer = await pdfQaHandler(prompt);
                res.json(pdfQaAnswer);
                break;
            case "GeneralQa":
                const generalQaAnswer = await generalQaHandler(prompt, conversationHistory, files, userId);
                res.json(generalQaAnswer);
                break;
            default:
                res.status(400).send("Invalid option provided.");
                break;
        }
    } catch (error) {
        next(error);
    }
});

export default router;
