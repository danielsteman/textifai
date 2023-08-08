import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import initializeClient from '../../lib/pinecone';
import { KB_COMBINE_PROMPT } from '../../utils/constants'
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import {ChatOpenAI} from "langchain/chat_models/openai";
import { RetrievalQAChain, loadQAMapReduceChain } from "langchain/chains";
import { RedisChatMessageHistory } from "langchain/stores/message/ioredis";
import { BufferMemory } from "langchain/memory";

const router = express.Router();

const envPath = path.resolve(__dirname, "../../../.env.local");

const initializedChain = async () => {

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY
  });

  const pineconeIndex = await initializeClient();

  const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings, { pineconeIndex }
  );

  const model = new ChatOpenAI({
    temperature: 0.1,
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo'
  });

  const chain = new RetrievalQAChain({
    combineDocumentsChain: loadQAMapReduceChain(model, { combinePrompt: KB_COMBINE_PROMPT }),
    retriever: vectorStore.asRetriever(),
  });

  const memory = new BufferMemory({
    chatHistory: new RedisChatMessageHistory({
      sessionId: new Date().toISOString(),
      sessionTTL: 300,
      url: "redis://localhost:6379",
    }),
    memoryKey: "chat_history"
  });
  
  return chain
}

let chain: RetrievalQAChain;
initializedChain().then(initializedChain => {
  chain = initializedChain;
  // You can now use the agent variable elsewhere in your code
});

dotenv.config({ path: envPath });

router.post(
  "/ask",
  async (
    req: Request<{ prompt: string }>,
    res: Response,
    next: NextFunction
  ) => {

    const question = req.body.prompt; 
    console.log(question)

    try {
      const answer = await chain.call({ query: question });
  
      console.log(answer.text)  
    res.json({ answer: answer.text });
    
  } catch (error) {
      next(error);
    }
  }
);

export default router;
