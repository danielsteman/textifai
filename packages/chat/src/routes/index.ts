import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import { getMatchesFromEmbeddings } from "../pinecone/matches";

import { templates } from "../langchain/prompts";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import summarizer from "../langchain/summarizer";

const router = express.Router();

const envPath = path.resolve(__dirname, "../../../.env.local");

const embed = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-ada-002",
});

// initialize QA chain
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

// QA Chain
let qaChain: LLMChain;
initializedChain().then((initializedChain) => {
  qaChain = initializedChain;
});

// initialize Inquiry chain
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

// Inquiry Chain
let inquiryChain: LLMChain;
initializedInquiryChain().then((initializedInquiryChain) => {
  inquiryChain = initializedInquiryChain;
});

// initialize Paraphrasing Chain
const initializedParapharingChain = async () => {
  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.3,
    topP: 1,
    verbose: false,
  });

  const ppChain = new LLMChain({
    llm,
    prompt: new PromptTemplate({
      template: templates.paraphrasingTemplate,
      inputVariables: ["document"],
    }),
    verbose: false,
  });

  return ppChain;
};

// Paraphrasing Chain
let paraphrasingChain: LLMChain;
initializedParapharingChain().then((initializedParapharingChain) => {
  paraphrasingChain = initializedParapharingChain;
});

dotenv.config({ path: envPath });

router.post(
  "/ask",
  async (
    req: Request<{ prompt: string; history: string; option: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const prompt = await req.body.prompt;
    const conversationHistory = await req.body.history;
    const option = await req.body.option;

    if (option==="Paraphrase"){
      try {
        console.log(prompt)
        const answer = await paraphrasingChain.call({
          document: prompt
        });

        console.log(answer.text);
        res.json({ answer: answer.text });
        
      } catch (error) {
        next(error);
      }

    } else if (option==="GeneralQa") {
      const inquiryChainResult = await inquiryChain.call({
        userPrompt: prompt,
        conversationHistory: conversationHistory,
      });

      console.log("Enhanced prompt: ", inquiryChainResult.text);
      const inquiry = inquiryChainResult.text;

      const vector = await embed.embedQuery(prompt);
      const matches = await getMatchesFromEmbeddings(vector, 3);

      interface Metadata {
        page: string;
        source: string;
        text: string;
      }

      const docs =
        matches &&
        Array.from(
          matches.reduce((map, match) => {
            const metadata = match.metadata as Metadata;
            const { text, page } = metadata;
            if (!map.has(page)) {
              map.set(page, text);
            }
            return map;
          }, new Map())
        ).map(([_, text]) => text);

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
        const answer = await qaChain.call({
          summaries: summary,
          question: inquiry,
          conversationHistory,
        });

        console.log(answer.text);
        res.json({ answer: answer.text });
        
      } catch (error) {
        next(error);
      }
    }
  }
);

export default router;
