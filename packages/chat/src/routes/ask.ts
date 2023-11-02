import express, { Request, Response, NextFunction } from "express";
import generalQaHandler from "../handlers/generalQaHandler";
import regenerateHandler from "../handlers/regenerateHandler";
import pdfQaHandler from "../handlers/pdfQaHandler";

const router = express.Router();

router.post("/ask", async (req: Request, res: Response, next: NextFunction) => {
  const prompt = req.body.prompt;
  const conversationHistory = req.body.history;
  const option = req.body.option;
  const files = req.body.files;
  const userId = req.body.userId;

  try {
    let result;
    if (option === "regenerate") {
      result = await regenerateHandler(prompt);
    } else if (option === "pdfQa") {
      result = await pdfQaHandler(prompt);
    } else if (option === "GeneralQa") {
      result = await generalQaHandler(prompt, conversationHistory, files, userId);
    } else {
      return res.status(400).send("Invalid option provided.");
    }
    res.json(result); 
  } catch (error) {
    next(error);
  }
});

export default router;