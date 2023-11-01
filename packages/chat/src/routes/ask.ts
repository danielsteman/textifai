import express, { NextFunction, Request, Response } from "express";
import { getMatchesFromEmbeddings } from "../pinecone/matches";
import { templates } from "../langchain/prompts";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import summarizer from "../langchain/summarizer";

interface Metadata {
  text: string;
  title: string;
  userId: string;
}

const router = express.Router();

const embed = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-ada-002",
});

const initializedChain = async () => {
  const qaChain = new ChatOpenAI({
    verbose: false,
    modelName: "gpt-3.5-turbo",
  });

  const chain = new LLMChain({
    prompt: new PromptTemplate({
      template: templates.qaTemplate,
      inputVariables: ["summaries", "question", "conversationHistory"],
    }),
    llm: qaChain,
    verbose: false,
  });

  return chain;
};

let qaChain: LLMChain;
initializedChain().then((initializedChain) => {
  qaChain = initializedChain;
});

const initializedInquiryChain = async () => {
  const llm = new ChatOpenAI({
    modelName: "gpt-4",
    temperature: 0.1,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 1,
    verbose: false,
  });

  const iqChain = new LLMChain({
    llm,
    prompt: new PromptTemplate({
      template: templates.inquiryTemplate,
      inputVariables: ["userPrompt", "conversationHistory"],
    }),
    verbose: false,
  });

  return iqChain;
};

let inquiryChain: LLMChain;
initializedInquiryChain().then((initializedInquiryChain) => {
  inquiryChain = initializedInquiryChain;
});

const initializedRegenerateChain = async () => {
  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.3,
    topP: 1,
    verbose: false,
  });

  const ppChain = new LLMChain({
    llm,
    prompt: new PromptTemplate({
      template: templates.regenerateTemplate,
      inputVariables: ["document"],
    }),
    verbose: false,
  });

  return ppChain;
};

let regenerateChain: LLMChain;
initializedRegenerateChain().then((initializedRenegerateChain) => {
  regenerateChain = initializedRenegerateChain;
});

const initializedPdfChain = async () => {
  const pdfChain = new ChatOpenAI({
    verbose: false,
    modelName: "gpt-3.5-turbo",
  });

  const chain = new LLMChain({
    prompt: new PromptTemplate({
      template: templates.pdfTemplate,
      inputVariables: ["context"],
    }),
    llm: pdfChain,
    verbose: false,
  });

  return chain;
};

let pdfChain: LLMChain;
initializedPdfChain().then((initializedPdfChain) => {
  pdfChain = initializedPdfChain;
});

router.post("/ask", async (req: Request, res: Response, next: NextFunction) => {
  const prompt = await req.body.prompt;
  const conversationHistory = await req.body.history;
  const option = await req.body.option;
  const files = await req.body.files;
  const userId = await req.body.userId;

  if (option === "regenerate") {
    try {
      console.log("Regenerating answer...");
      const answer = await regenerateChain.call({
        document: prompt,
      });

      console.log(answer.text);
      res.json({ answer: answer.text });
    } catch (error) {
      next(error);
    }
  } else if (option === "pdfQa") {
    try {
      console.log("Answering PdfViewer questions...");
      const answer = await pdfChain.call({
        context: prompt,
      });

      console.log(answer.text);
      res.json({ answer: answer.text });
    } catch (error) {
      next(error);
    }
  } else if (option === "GeneralQa") {
    const inquiryChainResult = await inquiryChain.call({
      userPrompt: prompt,
      conversationHistory: conversationHistory,
    });

    console.log("Enhanced prompt: ", inquiryChainResult.text);
    const inquiry = inquiryChainResult.text;

    const vector = await embed.embedQuery(prompt);
    const matches = await getMatchesFromEmbeddings(vector, 3, files, userId);

    console.log("Matches found: ", matches);

    const docs =
      matches &&
      matches.reduce((accumulator, match) => {
        const metadata = match.metadata as Metadata;
        accumulator.push(metadata.text);
        return accumulator;
      }, [] as string[]);

    console.log("Documents found: ", docs);

    const allDocs = docs.join("\n");

    if (allDocs.length > 4000) {
      console.log(`Context too long, summarize...`);
    }

    const summary =
      allDocs.length > 4000
        ? await summarizer.summarizeLongDocument({
            document: allDocs,
            inquiry: prompt,
          })
        : allDocs;

    try {
      const answerStream = await qaChain.stream({
        summaries: summary,
        question: inquiry,
        conversationHistory,
      });

      // console.log(answer.text);
      // res.json({ answer: answer.text });
      for await (const chunk of answerStream) {
        res.write(chunk);
      }
      res.end();
    } catch (error) {
      next(error);
    }
  }
});

export default router;
