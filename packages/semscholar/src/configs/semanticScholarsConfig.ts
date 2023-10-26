import dotenv from "dotenv";

interface ISemanicScholar {
  apiKey: string;
}

dotenv.config();

export const getSemanticScholarConfig = (): ISemanicScholar => {
  if (!process.env.SEMSCHOLAR_API_KEY) {
    throw new Error("Missing Open AI api key. Set SEMSCHOLAR_API_KEY");
  }
  return {
    apiKey: process.env.SEMSCHOLAR_API_KEY,
  };
};
