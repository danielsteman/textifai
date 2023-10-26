import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { config } from "../configs/config";
import { Index } from "@pinecone-database/pinecone";

export async function processText(
  index: Index,
  rawDoc: string,
  userId: string,
  title: string
) {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });

  const chunks = await textSplitter.splitText(rawDoc);

  const metadatas = chunks.map(() => ({
    userId: userId,
    title: title,
  }));

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: config.openApiConfig.apiKey,
    modelName: config.openApiConfig.textEmbeddingModel,
  });

  await PineconeStore.fromTexts(chunks, metadatas, embeddings, {
    pineconeIndex: index,
  });
}

export default processText;
