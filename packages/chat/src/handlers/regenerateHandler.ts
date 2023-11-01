import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { templates } from "../langchain/prompts";

// initialize Paraphrasing Chain
let regenerateChain: LLMChain<string, ChatOpenAI>;
const initializedRegenerateChain = async () => {
  const llm = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    temperature: 0.3,
    topP: 1,
    verbose: false,
  });

  const ppChain = new LLMChain({
    llm,
    prompt: new PromptTemplate({
      template: templates.regenerateTemplate,
      inputVariables: ["document"],
    }),
    verbose: false,
  });

  return ppChain;
};

initializedRegenerateChain().then((initializedRenegerateChain) => {
  regenerateChain = initializedRenegerateChain;
});

async function regenerateHandler(prompt: string) {
  console.log("Regenerating answer...");
  const answer = await regenerateChain.call({ document: prompt });
  console.log(answer.text);
  return { answer: answer.text };
}

export default regenerateHandler;