import { PineconeClient } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../.env.local");
dotenv.config({ path: envPath });

console.log(process.env.PINECONE_ENV);

if (!process.env.PINECONE_ENV! || !process.env.PINECONE_API_KEY!) {
  throw new Error("Pinecone environment or API key vars missing");
}

async function initializeClient() {
  try {
    const client = new PineconeClient();
    await client.init({
      apiKey: process.env.PINECONE_API_KEY!,
      environment: process.env.PINECONE_ENV!,
    });

    const pineconeIndex = client.Index(process.env.PINECONE_INDEX!);

    return pineconeIndex;
  } catch (error) {
    console.error(
      "An error occurred while initializing the Pinecone client:",
      error
    );
    throw new Error("Failed to initialize Pinecone Client");
  }
}

export default initializeClient;
