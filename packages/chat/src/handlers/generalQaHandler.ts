import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { templates } from "../utils/prompts";
import { getMatchesFromEmbeddings } from "../pinecone/matches";
import summarizer from "../utils/summarizer";
import { ScoredVector } from "@pinecone-database/pinecone";

// Initialize OpenAI Embeddings
const embed = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
  modelName: "text-embedding-ada-002",
});

// Initialize QA Chain
let qaChain: LLMChain<string, ChatOpenAI>;
const initializedChain = async () => {
  const chain = new ChatOpenAI({
    verbose: false,
    modelName: "gpt-4",
    temperature: 0.5
  });

  const qaChain = new LLMChain({
    prompt: new PromptTemplate({
      template: templates.qaTemplate,
      inputVariables: ["context", "question", "conversationHistory"],
    }),
    llm: chain,
    verbose: false,
  });

  return qaChain;
};
initializedChain().then((chain) => {
  qaChain = chain;
});

// Initialize Inquiry Chain
let inquiryChain: LLMChain<string, ChatOpenAI>;
const initializedInquiryChain = async () => {
  const llm = new ChatOpenAI({
    modelName: "gpt-4",
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

async function generalQaHandler(
    prompt: string, 
    conversationHistory: string, 
    files: string[], 
    userId: string
 ) {
  console.log("Answering GeneralQa questions...");
  const inquiryChainResult = await inquiryChain.call({
    userPrompt: prompt,
    conversationHistory: conversationHistory,
  });

  console.log("Enhanced prompt: ", inquiryChainResult.text);
  const inquiry = inquiryChainResult.text;

  const vector = await embed.embedQuery(prompt);
  const matches = await getMatchesFromEmbeddings(vector, 3, files, userId);
  //const filteredResults = matches.filter((match): match is ScoredVector & { score: number } => match.score !== undefined && match.score >= 0.75);

  console.log("Matches found: ", matches);

  // Build new feature, 
  // If there are no matches, return a that the question couldn't be answered 
  // Create a new and more specified question and find relevant information

  interface Metadata {
    text: string;
    title: string;
    userId: string;
  }

  const docs = matches && matches.reduce((accumulator, match) => {
    const metadata = match.metadata as Metadata; 
    accumulator.push(metadata.text);
    return accumulator;
  }, [] as string[]);

  const allDocs = docs.join("\n");

  if (allDocs.length > 4000) {
    console.log(`Context too long, summarize...`);
  }

  const summary =
    allDocs.length > 4000
      ? await summarizer.summarizeLongDocument({
          document: allDocs,
          inquiry: prompt,
        })
      : allDocs;

  const answer = await qaChain.call({
    context: summary,
    question: inquiry,
    conversationHistory,
  });

  console.log(answer.text);
  return { answer: answer.text };
}

export default generalQaHandler;
