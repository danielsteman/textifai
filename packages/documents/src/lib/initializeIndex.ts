import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "../configs/config";

export async function initializeIndex() {
  try {
    const pinecone = new Pinecone({
      apiKey: config.pineconeConfig.apiKey,
      environment: config.pineconeConfig.environment,
    });
    const index = await pinecone.createIndex({
      name: config.pineconeConfig.pineconeIndex,
      dimension: config.pineconeConfig.pineconeDimension,
    });
    return index;
  } catch (error) {
    console.error("Failed to initialize Pinecone Client:", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}
