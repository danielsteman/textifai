import { PineconeClient, ScoredVector } from "@pinecone-database/pinecone";
import initializeClient from "./pinecone";
import dotenv from "dotenv";
import path from "path";

const envPath = path.resolve(__dirname, "../../.env.local");

dotenv.config({ path: envPath })
export type Metadata = {
  page: string;
  source: string;
  text: string;
};

const getMatchesFromEmbeddings = async (
  embeddings: number[],
  topK: number,
): Promise<ScoredVector[]> => {

  const index = await initializeClient();

  const queryRequest = {
    vector: embeddings,
    topK,
    includeMetadata: true,
  };

  try {
    const queryResult = await index.query({
      queryRequest,
    });

    return queryResult.matches?.map((match) => ({
      ...match,
      metadata: match.metadata as Metadata,
    })
    ) || [];
  } catch (e) {
    console.log("Error querying embeddings: ", e);

    throw (new Error(`Error querying embeddings: ${e}`));
  }
};

export { getMatchesFromEmbeddings };