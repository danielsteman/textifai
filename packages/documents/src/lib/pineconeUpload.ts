import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { PineconeClient } from "@pinecone-database/pinecone";

async function initializeClient(
  apiKey: string,
  environment: string,
  pineconeIndex: string
) {
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

export async function processFile(
  rawDoc: string,
  apiKey: string,
  environment: string,
  pineconeIndex: string,
  userId: string,
  title: string,
) {
  const index = await initializeClient(apiKey, environment, pineconeIndex);

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

  // Creating metadata for each chunk
  const metadataArray = chunks.map(() => ({
    userId: userId,
    title: title,
  }));

  try {
    console.log("Starting to create and store embeddings.");
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: "text-embedding-ada-002",
    });
    console.log("OpenAI client initialized.");

    // Embed the PDF documents
    // Here I assume you need a way to pass the metadata alongside the chunks.
    // If PineconeStore doesn't handle metadata, you might have to handle it separately.
    await PineconeStore.fromTexts(
      chunks, 
      metadataArray, // passing metadata here
      embeddings, 
      {
        pineconeIndex: index,
        textKey: "text",
      }
    );
    console.log("Embeddings successfully stored in vector store.");
  } catch (error) {
    console.error("Failed to embed data in the vector store:", error);
    throw new Error("Failed to embed data in the vector store");
  }
}

export default processFile;
