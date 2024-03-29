import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { templates } from "../utils/prompts";
import { getMatchesFromEmbeddings } from "../pinecone/matches";

interface Metadata {
  text: string;
  title: string;
  userId: string;
}

export const retrievalAugmentedGenerator = async (
  prompt: string,
  conversationHistory: string,
  files: string[],
  userId: string
) => {
  const embed = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: "text-embedding-ada-002",
  });

  const inquiryChain = new LLMChain({
    prompt: new PromptTemplate({
      template: templates.inquiryTemplate,
      inputVariables: ["userPrompt", "conversationHistory"],
    }),
    llm: new ChatOpenAI({
      modelName: "gpt-4-1106-preview",
      temperature: 0.3,
      topP: 1,
      frequencyPenalty: 0,
      presencePenalty: 1,
      verbose: false,
    }),
    verbose: false,
  });

  const inquiryChainResult = await inquiryChain.call({
    userPrompt: prompt,
    conversationHistory: conversationHistory,
  });

  const inquiry = inquiryChainResult.text;
  const vector = await embed.embedQuery(prompt);
  const matches = await getMatchesFromEmbeddings(vector, 10, files, userId);

  const docs =
    matches &&
    matches.reduce((accumulator, match) => {
      const metadata = match.metadata as Metadata;
      accumulator.push(metadata.text);
      return accumulator;
    }, [] as string[]);

  const context = docs.join("\n");

  const llm = new ChatOpenAI({
    verbose: true,
    modelName: "gpt-4-1106-preview",
    temperature: 1,
    streaming: true,
  });

  const promptTemplate = PromptTemplate.fromTemplate(templates.qaTemplate);
  const runnable = promptTemplate.pipe(llm);

  const stream = await runnable.stream({
    context,
    question: inquiry,
    conversationHistory,
  });

  return stream;
};

export const retrievalAugmentedRegenerator = async (prompt: string) => {
  const llm = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
    temperature: 1,
    topP: 1,
    verbose: false,
  });

  const promptTemplate = PromptTemplate.fromTemplate(
    templates.regenerateTemplate
  );

  const runnable = promptTemplate.pipe(llm);
  const stream = await runnable.stream({
    document: prompt,
  });

  return stream;
};

export const pdfAugmentedGenerator = async (pdfExtract: string) => {
  const llm = new ChatOpenAI({
    modelName: "gpt-4-1106-preview",
    temperature: 1,
    verbose: false,
  });

  const promptTemplate = PromptTemplate.fromTemplate(templates.pdfTemplate);

  const runnable = promptTemplate.pipe(llm);
  const stream = await runnable.stream({
    context: pdfExtract,
  });

  return stream;
};
