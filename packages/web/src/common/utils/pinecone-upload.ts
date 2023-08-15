import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import initializeClient from "../../../../chat/lib/pinecone";


async function processFile (file: File) {
  let index;
  try {
    console.log('Initializing Pinecone client.');
    index = await initializeClient();
    console.log('Pinecone client initialized.');
  } catch (error) {
    console.error('Failed to initialize Pinecone client:', error);
    throw new Error('Failed to initialize Pinecone client');
  }

  let rawDoc;
  try {
    console.log('Starting to load PDF document.');
    const loader = new PDFLoader(file);
    rawDoc = await loader.load();
    console.log('PDF document loaded successfully.');
  } catch (error) {
    console.error('Failed to read document:', error);
    throw new Error('Failed to read document');
  };

  let docs;
  try {
    console.log('Starting to split document into chunks.');
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });

    docs = await textSplitter.splitDocuments(rawDoc);
    console.log(`Document successfully split into ${docs.length} chunks.`);
  } catch (error) {
    console.error('Failed to chunk document:', error);
    throw new Error('Failed to chunk document');
  }

  try {
    console.log('Starting to create and store embeddings.');
    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY, 
      modelName: "text-embedding-ada-002"
    });
    console.log('OpenAI client initialized.');

    // Embed the PDF documents
    await PineconeStore.fromDocuments(docs, embeddings, {
      pineconeIndex: index,
      textKey: 'text',
    });
    console.log('Embeddings successfully stored in vector store.');
  } catch (error) {
    console.error('Failed to embed data in the vector store:', error);
    throw new Error('Failed to embed data in the vector store');
  }
};

export { processFile };