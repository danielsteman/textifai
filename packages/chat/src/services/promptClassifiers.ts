import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { templates } from "../utils/prompts";
import { LLMChain } from "langchain/chains";

type PromptVariant = "rag" | "summarize";

export const promptClassifier = async (
  prompt: string
): Promise<PromptVariant> => {
  const classificationChain = new LLMChain({
    prompt: new PromptTemplate({
      template: templates.promptClassifier,
      inputVariables: ["question"],
    }),
    llm: new ChatOpenAI({
      modelName: "gpt-4-1106-preview",
      temperature: 1,
      verbose: false,
    }),
    verbose: false,
  });

  const result = await classificationChain.call({
    question: prompt,
  });

  return result.text;
};
