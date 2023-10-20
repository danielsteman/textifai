import { PineconeClient } from "@pinecone-database/pinecone";
import { config } from "../configs/config";

export async function initializeIndex() {
  try {
    const pinecone = new PineconeClient();

    await pinecone.init({
      apiKey: config.pineconeConfig.apiKey,
      environment: config.pineconeConfig.environment,
    });

    return pinecone.Index(config.pineconeConfig.pineconeIndex);
  } catch (error) {
    console.error(
      "An error occurred while initializing the Pinecone client:",
      error
    );
    throw new Error("Failed to initialize Pinecone Client");
  }
}
