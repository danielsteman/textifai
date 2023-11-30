import { Request, Response, NextFunction } from "express";
import {
  pdfAugmentedGenerator,
  retrievalAugmentedGenerator,
  retrievalAugmentedRegenerator,
} from "../services/augmentedGenerators";
import { titleClassifier } from "../services/titleClassifier";
import { promptClassifier } from "../services/promptClassifiers";
import { summarizer } from "../services/summarizers";
import { openAiLLM } from "../services/llms";
import { textExtractor } from "../services/textExtractors";

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

    const classification = await promptClassifier(prompt);
    console.log(`Prompt is classified as ${classification}`);

    switch (classification) {
      case "rag":
        stream = await retrievalAugmentedGenerator(
          prompt,
          req.body.history,
          req.body.files,
          req.body.userId
        );
        break;
      case "summarize":
        const articleText = await textExtractor(
          req.body.userId,
          req.body.files
        );
        stream = summarizer(prompt, req.body.history, articleText);
        break;
      case "vanilla":
        stream = openAiLLM(prompt);
        break;
      default:
        console.warn("Couldn't classify prompt");
        break;
    }

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
