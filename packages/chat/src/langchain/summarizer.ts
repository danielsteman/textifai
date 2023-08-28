import { ChatOpenAI } from "langchain/chat_models/openai";
import { templates } from "./prompts";
import { LLMChain } from "langchain/chains";
import { PromptTemplate } from "langchain/prompts";
import Bottleneck from "bottleneck";

const llm = new ChatOpenAI({
  //concurrency: 10,
  temperature: 0,
  modelName: "gpt-3.5-turbo",
});

const { summarizerTemplate, summarizerDocumentTemplate } = templates;
const limiter = new Bottleneck({
  minTime: 5050,
});

console.log(summarizerDocumentTemplate.length);

const chunkSubstr = (str: string, size: number) => {
  const numChunks = Math.ceil(str.length / size);

  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
    chunks[i] = str.substring(o, size);
  }

  return chunks;
};

const summarize = async (
  { document, inquiry, onSummaryDone }: {
    document: string;
    inquiry?: string;
    onSummaryDone?: Function;
  },
) => {
  console.log("summarizing ", document.length);

  const promptTemplate = new PromptTemplate({
    template: inquiry ? summarizerTemplate : summarizerDocumentTemplate,
    inputVariables: inquiry ? ["document", "inquiry"] : ["document"],
  });

  const chain = new LLMChain({
    prompt: promptTemplate,
    llm,
  });

  try {
    const result = await chain.call({
      prompt: promptTemplate,
      document,
      inquiry,
    });

    console.log(result);

    onSummaryDone && onSummaryDone(result.text);
    return result.text;
  } catch (e) {
    console.log(e);
  }
};

const rateLimitedSummarize = limiter.wrap(summarize);

const summarizeLongDocument = async (
  { document, inquiry, onSummaryDone }: {
    document: string;
    inquiry?: string;
    onSummaryDone?: Function;
  },
): Promise<string> => {
  // Chunk document into 4000 character chunks
  const templateLength = inquiry
    ? summarizerTemplate.length
    : summarizerDocumentTemplate.length;

  console.log("====== summarizing");

  try {
    if ((document.length + templateLength) > 4000) {
      console.log("document is long and has to be shortened", document.length);

      const chunks = chunkSubstr(document, 4000 - templateLength - 1);

      let summarizedChunks: string[] = [];

      summarizedChunks = await Promise.all(
        chunks.map(async (chunk) => {
          let result;

          if (inquiry) {
            result = await rateLimitedSummarize({
              document: chunk,
              inquiry,
              onSummaryDone,
            });
          } else {
            result = await rateLimitedSummarize({
              document: chunk,
              onSummaryDone,
            });
          }

          return result;
        }),
      );

      const result = summarizedChunks.join("\n");

      console.log(result.length);

      if ((result.length + templateLength) > 4000) {
        console.log("document is STILL long and has to be shortened further");

        return await summarizeLongDocument({
          document: result,
          inquiry,
          onSummaryDone,
        });
      } else {
        console.log("done");

        return result;
      }
    } else {
      return document;
    }
  } catch (e) {
    throw new Error(e as string);
  }
};

export default { summarizeLongDocument };