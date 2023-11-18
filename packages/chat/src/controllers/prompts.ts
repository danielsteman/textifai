import { Request, Response, NextFunction } from "express";
import promptClassifierHandler from "../handlers/promptClassifierHandler";
import generalQaHandler from "../handlers/generalQaHandler";
import pdfQaHandler from "../handlers/pdfQaHandler";
import regenerateHandler from "../handlers/regenerateHandler";
import summarizationHandler from "../handlers/summarizationHandler";
import {
  pdfAugmentedGenerator,
  retrievalAugmentedGenerator,
  retrievalAugmentedRegenerator,
} from "../services/augmentedGenerators";
import { titleClassifier } from "../services/titleClassifier";

export const postPrompt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
};

interface StreamingRAGPromptRequest {
  prompt: string;
  history: string;
  files: string[];
  userId: string;
  regenerate?: boolean;
  promptFromExtract?: string;
}

export const postStreamingRAGPrompt = async (
  req: Request<{}, {}, StreamingRAGPromptRequest>,
  res: Response,
  next: NextFunction
) => {
  res.writeHead(200, {
    "Content-Type": "text/plain",
    "Transfer-Encoding": "chunked",
  });

  const prompt = req.body.prompt;
  let stream;

  if (req.body.regenerate) {
    console.log("Pass prompt to retrievalAugmentedRegenerator");

    stream = await retrievalAugmentedRegenerator(prompt);
  } else if (req.body.promptFromExtract) {
    stream = await pdfAugmentedGenerator(req.body.promptFromExtract);
  } else {
    console.log("Pass prompt to retrievalAugmentedGenerator");

    stream = await retrievalAugmentedGenerator(
      prompt,
      req.body.history,
      req.body.files,
      req.body.userId
    );
  }

  for await (const chunk of stream) {
    res.write(chunk?.content);
  }

  res.status(200).end();
};

interface titleClassifierPromptRequest {
  prompt: string;
}

export const postTitleClassfierPrompt = async (
  req: Request<{}, {}, titleClassifierPromptRequest>,
  res: Response,
  next: NextFunction
) => {
  const prompt = req.body.prompt;

  const title = await titleClassifier(prompt);

  res.status(200).send(title);
};
