import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { templates } from "../utils/prompts";
import { LLMChain } from "langchain/chains";

export const titleClassifier = async (prompt: string) => {
  const classifyTitleChain = new LLMChain({
    prompt: new PromptTemplate({
      template: templates.conversationTitleTemplate,
      inputVariables: ["userPrompt"],
    }),
    llm: new ChatOpenAI({
      verbose: false,
      modelName: "gpt-4-1106-preview",
      temperature: 1,
    }),
    verbose: false,
  });

  const title = await classifyTitleChain.call({
    userPrompt: prompt,
  });

  return title;
};
