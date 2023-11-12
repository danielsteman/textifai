import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { templates } from "../utils/prompts";
import { LLMChain } from "langchain/chains";

export const promptClassifier = async (prompt: string) => {
  const llm = new ChatOpenAI({
    verbose: false,
    modelName: "gpt-4-1106-preview",
    temperature: 1,
  });

  const promptClassifierChain = new LLMChain({
    prompt: new PromptTemplate({
      template: templates.promptClassifier,
      inputVariables: ["question"],
    }),
    llm: llm,
    verbose: false,
  });

  const promptTemplate = PromptTemplate.fromTemplate(
    templates.promptClassifier
  );

  const runnable = promptTemplate.pipe(promptClassifierChain);
  const stream = await runnable.stream({
    question: prompt,
  });

  return stream;
};
