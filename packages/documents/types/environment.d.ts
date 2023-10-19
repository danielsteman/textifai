declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV?: "development" | "production";
      PORT?: string;

      PINECONE_API_KEY: string;
      PINECONE_ENV: string;
      PINECONE_INDEX: string;
      OPENAI_API_KEY: string;
    }
  }
}

export {};
