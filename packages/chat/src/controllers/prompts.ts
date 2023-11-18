import { Request, Response, NextFunction } from "express";
import {
  pdfAugmentedGenerator,
  retrievalAugmentedGenerator,
  retrievalAugmentedRegenerator,
} from "../services/augmentedGenerators";
import { titleClassifier } from "../services/titleClassifier";

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
