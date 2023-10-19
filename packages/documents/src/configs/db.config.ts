interface IPineconeConfig {
  apiKey: string;
  environment: string;
  pineconeIndex: string;
}

export const getPineconeConfig = (): IPineconeConfig => {
  if (!process.env.PINECONE_API_KEY) {
    throw new Error("Missing Pinecone API key. Set PINECONE_API_KEY.");
  }
  if (!process.env.PINECONE_ENV) {
    throw new Error("Missing Pinecone environment. Set PINECONE_ENV");
  }
  if (!process.env.PINECONE_INDEX) {
    throw new Error("Missing Pinecone index. Set PINECONE_INDEX");
  }
  return {
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENV,
    pineconeIndex: process.env.PINECONE_INDEX,
  };
};
