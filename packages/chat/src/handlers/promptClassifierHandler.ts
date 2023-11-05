import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { templates } from "../utils/prompts";

// Prompt Classifier chain initialization
let promptClassifier: LLMChain<string, ChatOpenAI>;
const categoriseChain = async () => {
  const chain = new ChatOpenAI({
    verbose: false,
    modelName: "gpt-4",
    temperature: 1
  });

  const promptClassifier = new LLMChain({
    prompt: new PromptTemplate({
      template: templates.promptClassifier,
      inputVariables: ["question"],
    }),
    llm: chain,
    verbose: false,
  });

  return promptClassifier;
};

categoriseChain().then((chain) => {
  promptClassifier = chain;
});

async function promptClassifierHandler(prompt: string) {
  console.log("Classifiyingn prompt...");
  const answer = await promptClassifier.call({ question: prompt });
  console.log(answer.text);
  return { answer: answer.text };
}

export default promptClassifierHandler;
