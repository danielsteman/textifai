import { getPineconeConfig } from "./db.config";
import { getOpenApiConfig } from "./openai.config";

export const config = {
  pineconeConfig: getPineconeConfig(),
  openApiConfig: getOpenApiConfig(),
};
