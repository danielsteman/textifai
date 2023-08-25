import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";

import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../.env.local");
dotenv.config({ path: envPath });

const apiKey = process.env.PINECONE_API_KEY!;
const environment = process.env.PINECONE_ENV!;
const pineconeIndex = process.env.PINECONE_INDEX!;

if (!apiKey || !environment || !pineconeIndex) {
  console.error("Missing environment variables");
  throw new Error(
    "Failed to initialize Pinecone Client due to missing environment variables"
  );
}

async function initializeClient() {
  try {
    const client = new PineconeClient();
    await client.init({
      apiKey,
      environment,
    });
    return client.Index(pineconeIndex);
  } catch (error) {
    console.error(
      "An error occurred while initializing the Pinecone client:",
      error
    );
    throw new Error("Failed to initialize Pinecone Client");
  }
}

export async function processFile(rawDoc: string) {
  const index = await initializeClient();

  let chunks;
  try {
    console.log("Starting to split document into chunks.");
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    chunks = await textSplitter.splitText(rawDoc);
    console.log(`Document successfully split into ${chunks.length} chunks.`);
  } catch (error) {
    console.error("Failed to chunk document:", error);
    throw new Error("Failed to chunk document");
  }

  try {
    console.log("Starting to create and store embeddings.");
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-ada-002",
    });
    console.log("OpenAI client initialized.");

    // Embed the PDF documents
    await PineconeStore.fromTexts(
      chunks, 
      {}, 
      embeddings, 
      {
        pineconeIndex: index,
        textKey: "text"
      });
    console.log("Embeddings successfully stored in vector store.");
  } catch (error) {
    console.error("Failed to embed data in the vector store:", error);
    throw new Error("Failed to embed data in the vector store");
  }
}

export default processFile;
