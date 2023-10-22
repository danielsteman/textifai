import { Pinecone } from "@pinecone-database/pinecone";
import { config } from "../configs/config";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";

export async function initializePineconeClient(): Promise<
  Index<RecordMetadata>
> {
  try {
    const pinecone = new Pinecone({
      apiKey: config.pineconeConfig.apiKey,
      environment: config.pineconeConfig.environment,
    });
    return pinecone.Index(config.pineconeConfig.pineconeIndex);
  } catch (error) {
    console.error("Failed to initialize Pinecone Client:", error);
    throw new Error("Failed to initialize Pinecone Client");
  }
}
