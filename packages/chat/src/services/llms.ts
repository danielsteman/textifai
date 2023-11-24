import { ChatOpenAI } from "langchain/chat_models/openai";
import { BaseMessageChunk } from "langchain/schema";

export const openAiLLM = async (
  prompt: string
): Promise<ReadableStream<BaseMessageChunk>> => {
  const gpt4LLM = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
    temperature: 1,
    verbose: false,
  });
  const result = await gpt4LLM.stream(prompt);
  return result;
};
