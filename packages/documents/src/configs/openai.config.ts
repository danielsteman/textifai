import dotenv from "dotenv";

interface IOpenAiConfig {
  apiKey: string;
  textEmbeddingModel: string;
}

dotenv.config();

export const getOpenApiConfig = (): IOpenAiConfig => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing Open AI api key. Set OPENAI_API_KEY");
  }
  return {
    apiKey: process.env.OPENAI_API_KEY,
    textEmbeddingModel: "text-embedding-ada-002",
  };
};
