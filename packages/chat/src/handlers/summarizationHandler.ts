import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { templates } from "../utils/prompts";

// Initialize QA Chain
let summarizationChain: LLMChain<string, ChatOpenAI>;
const initializedChain = async () => {
  const chain = new ChatOpenAI({
    verbose: false,
    modelName: "gpt-4-1106-preview",
    temperature: 1
  });

  const summarizationChain = new LLMChain({
    prompt: new PromptTemplate({
      template: templates.summarizationTemplate,
      inputVariables: ["context", "userPrompt"],
    }),
    llm: chain,
    verbose: false,
  });

  return summarizationChain;
};
initializedChain().then((chain) => {
  summarizationChain = chain;
});

// Initialize Inquiry Chain
let inquiryChain: LLMChain<string, ChatOpenAI>;
const initializedInquiryChain = async () => {
  const llm = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
    temperature: 0.3,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 1,
    verbose: false,
  });

  const chain = new LLMChain({
    llm,
    prompt: new PromptTemplate({
      template: templates.inquiryTemplate,
      inputVariables: ["userPrompt", "conversationHistory"],
    }),
    verbose: false,
  });

  return chain;
};
initializedInquiryChain().then((chain) => {
  inquiryChain = chain;
});

async function summarizationHandler(
    prompt: string, 
    conversationHistory: string,
    extractedText: string
 ) {
  console.log("Summarizing user prompt...");
  const inquiryChainResult = await inquiryChain.call({
    userPrompt: prompt,
    conversationHistory: conversationHistory,
  });

  console.log("Enhanced prompt: ", inquiryChainResult.text);
  const inquiry = inquiryChainResult.text;

    const answer = await summarizationChain.call({
    context: extractedText,
    userPrompt: inquiry,
  });

  console.log(answer.text);
  return { answer: answer.text };
}

export default summarizationHandler;
