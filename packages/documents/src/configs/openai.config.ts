interface IOpenAiConfig {
  apiKey: string;
}

export const getOpenApiConfig = (): IOpenAiConfig => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("Missing Open AI api key. Set OPENAI_API_KEY");
  }
  return {
    apiKey: process.env.OPENAI_API_KEY,
  };
};
