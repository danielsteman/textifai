import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { templates } from "../utils/prompts";
import { LLMChain } from "langchain/chains";
import { BaseMessageChunk } from "langchain/schema";

export const summarizer = async (
  prompt: string,
  history: string,
  extractedText: string
): Promise<ReadableStream<BaseMessageChunk>> => {
  const summarizationLLM = new ChatOpenAI({
    verbose: false,
    modelName: "gpt-4-1106-preview",
    temperature: 1,
  });

  const summarizationPromptTemplate = PromptTemplate.fromTemplate(
    templates.summarizationTemplate
  );

  const summarizationChain = summarizationPromptTemplate.pipe(summarizationLLM);

  const inquiryLLM = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
    temperature: 0.3,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 1,
    verbose: false,
  });

  const inquiryChain = new LLMChain({
    llm: inquiryLLM,
    prompt: new PromptTemplate({
      template: templates.inquiryTemplate,
      inputVariables: ["userPrompt", "conversationHistory"],
    }),
    verbose: false,
  });

  const inquiryChainResult = await inquiryChain.call({
    userPrompt: prompt,
    conversationHistory: history,
  });

  const stream = await summarizationChain.stream({
    context: extractedText,
    userPrompt: inquiryChainResult.text,
  });

  return stream;
};
