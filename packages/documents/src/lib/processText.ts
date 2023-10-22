import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { config } from "../configs/config";

export async function processText(
  index: any,
  rawDoc: string,
  userId: string,
  title: string
) {
  console.log("index");
  console.log(index);

  let chunks;
  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    chunks = await textSplitter.splitText(rawDoc);
  } catch (error) {
    console.error("Failed to chunk document:", error);
    throw new Error("Failed to chunk document");
  }

  const metadataArray = chunks.map(() => ({
    userId: userId,
    title: title,
  }));

  try {
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: config.openApiConfig.apiKey,
      modelName: config.openApiConfig.textEmbeddingModel,
    });

    await PineconeStore.fromTexts(chunks, metadataArray, embeddings, {
      pineconeIndex: index,
      textKey: "text",
    });
  } catch (error) {
    console.error("Failed to embed data in the vector store:", error);
    throw new Error("Failed to embed data in the vector store");
  }
}

export default processText;
