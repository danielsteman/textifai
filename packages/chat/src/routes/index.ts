import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";
import initializeClient from '../../lib/pinecone';
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import {ChatOpenAI} from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationalRetrievalQAChain } from "langchain/chains";

const router = express.Router();

const envPath = path.resolve(__dirname, "../../../.env.local");

dotenv.config({ path: envPath });

router.post(
  "/ask",
  async (
    req: Request<{ prompt: string }>,
    res: Response,
    next: NextFunction
  ) => {
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
      modelName: 'gpt-3.5-turbo' }
    );
    
    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorStore.asRetriever(),
      {
        memory: new BufferMemory({
          memoryKey: "chat_history", // Must be set to "chat_history"
        })
      }
    );

    const question = req.body.prompt; 
    console.log(question)
    try {
      const answer = await chain.call({ 
        question
      });
    console.log(answer.text)  
    res.json({ answer: answer.text });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
