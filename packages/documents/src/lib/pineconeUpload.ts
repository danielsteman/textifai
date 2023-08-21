import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PineconeClient } from "@pinecone-database/pinecone";
import { PDFLoader } from "langchain/document_loaders/fs/pdf"

import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../.env.local");
dotenv.config({ path: envPath });

const apiKey = process.env.PINECONE_API_KEY!;
const environment = process.env.PINECONE_ENV!;
const pineconeIndex = process.env.PINECONE_INDEX!;

if (!apiKey || !environment || !pineconeIndex) {
  console.error("Missing environment variables");
  throw new Error("Failed to initialize Pinecone Client due to missing environment variables");
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

export async function processFile(file: File) {
  const index = await initializeClient();

  // Convert Buffer to Blob
  // const fileBlob = new Blob([fileBuffer], { type: "application/pdf" });

  let rawDoc;
  try {
    console.log("Starting to load PDF document.");
    
    const loader = new PDFLoader(file);
    rawDoc = await loader.load();

    console.log("PDF document loaded successfully.");
  } catch (error) {
    console.error("Failed to read document:", error);
    throw new Error("Failed to read document");
  }

  let docs;
  try {
    console.log("Starting to split document into chunks.");
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    docs = await textSplitter.splitDocuments(rawDoc);
    console.log(`Document successfully split into ${docs.length} chunks.`);
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
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });
    console.log("Embeddings successfully stored in vector store.");
  } catch (error) {
    console.error("Failed to embed data in the vector store:", error);
    throw new Error("Failed to embed data in the vector store");
  }
}

export default processFile