import express, { Request, Response, NextFunction } from "express";
import generalQaHandler from "../handlers/generalQaHandler";
import regenerateHandler from "../handlers/regenerateHandler";
import pdfQaHandler from "../handlers/pdfQaHandler";
import promptClassifierHandler from "../handlers/promptClassifierHandler";
import summarizationHandler from "../handlers/summarizationHandler";

const router = express.Router();

router.post("/ask", async (req: Request, res: Response, next: NextFunction) => {
  const prompt = req.body.prompt;
  const conversationHistory = req.body.history;
  const option = req.body.option;
  const files = req.body.files;
  const userId = req.body.userId;
  const extractedText = req.body.extractedText;

  try {
    let result;
    const classifierResult = await promptClassifierHandler(prompt);
    const classifier = classifierResult.answer;
    console.log("Prompt is classified as: ", classifier);

    switch (classifier) {
      case "rag":
        switch (option) {
          case "regenerate":
            result = await regenerateHandler(prompt);
            console.log("Result received: ", result);
            break;
          case "pdfQa":
            result = await pdfQaHandler(prompt);
            console.log("Result received: ", result);
            break;
          case "GeneralQa":
            result = await generalQaHandler(
              prompt,
              conversationHistory,
              files,
              userId
            );
            console.log("Result received: ", result);
            break;
          default:
            return res.status(400).send("Invalid option provided.");
        }
        if (result) {
          res.json(result);
        }
        break;
      case "else":
        result = await summarizationHandler(
          extractedText,
          prompt,
          conversationHistory
        );
        if (result) {
          res.json(result);
        }
        break;
      default:
        res.status(400).send("Unknown classifier response.");
        break;
    }
  } catch (error) {
    next(error);
  }
});

export default router;
