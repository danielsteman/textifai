import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { templates } from "../langchain/prompts";

// PDF QA chain initialization
let pdfChain: LLMChain<string, ChatOpenAI>;
const initializedPdfChain = async () => {
  const chain = new ChatOpenAI({
    verbose: false,
    modelName: "gpt-3.5-turbo",
  });

  const pdfChain = new LLMChain({
    prompt: new PromptTemplate({
      template: templates.pdfTemplate,
      inputVariables: ["context"],
    }),
    llm: chain,
    verbose: false,
  });

  return pdfChain;
};

initializedPdfChain().then((chain) => {
  pdfChain = chain;
});

async function pdfQaHandler(prompt: string) {
  console.log("Answering PdfViewer questions...");
  const answer = await pdfChain.call({ context: prompt });
  console.log(answer.text);
  return { answer: answer.text };
}

export default pdfQaHandler;
