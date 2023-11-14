import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { templates } from "../utils/prompts";
import { LLMChain } from "langchain/chains";

export const titleClassifier = async (prompt: string) => {
  const llm = new ChatOpenAI({
    verbose: false,
    modelName: "gpt-4-1106-preview",
    temperature: 1,
  });

  const conversationTitleChain = new LLMChain({
    prompt: new PromptTemplate({
      template: templates.conversationTitleTemplate,
      inputVariables: ["userPrompt"],
    }),
    llm: llm,
    verbose: false,
  });

  const promptTemplate = PromptTemplate.fromTemplate(
    templates.conversationTitleTemplate
  );

  const runnable = promptTemplate.pipe(conversationTitleChain);
  const stream = await runnable.stream({
    question: prompt,
  });

  return stream;
};
