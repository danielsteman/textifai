"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("langchain/chat_models/openai");
const prompts_1 = require("./prompts");
const langchain_1 = require("langchain");
const bottleneck_1 = __importDefault(require("bottleneck"));
const llm = new openai_1.ChatOpenAI({
    //concurrency: 10,
    temperature: 0,
    modelName: "gpt-3.5-turbo",
});
const { summarizerTemplate, summarizerDocumentTemplate } = prompts_1.templates;
const limiter = new bottleneck_1.default({
    minTime: 5050,
});
console.log(summarizerDocumentTemplate.length);
const chunkSubstr = (str, size) => {
    const numChunks = Math.ceil(str.length / size);
    const chunks = new Array(numChunks);
    for (let i = 0, o = 0; i < numChunks; ++i, o += size) {
        chunks[i] = str.substring(o, size);
    }
    return chunks;
};
const summarize = async ({ document, inquiry, onSummaryDone }) => {
    console.log("summarizing ", document.length);
    const promptTemplate = new langchain_1.PromptTemplate({
        template: inquiry ? summarizerTemplate : summarizerDocumentTemplate,
        inputVariables: inquiry ? ["document", "inquiry"] : ["document"],
    });
    const chain = new langchain_1.LLMChain({
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
    }
    catch (e) {
        console.log(e);
    }
};
const rateLimitedSummarize = limiter.wrap(summarize);
const summarizeLongDocument = async ({ document, inquiry, onSummaryDone }) => {
    // Chunk document into 4000 character chunks
    const templateLength = inquiry
        ? summarizerTemplate.length
        : summarizerDocumentTemplate.length;
    console.log("====== summarizing");
    try {
        if ((document.length + templateLength) > 4000) {
            console.log("document is long and has to be shortened", document.length);
            const chunks = chunkSubstr(document, 4000 - templateLength - 1);
            let summarizedChunks = [];
            summarizedChunks = await Promise.all(chunks.map(async (chunk) => {
                let result;
                if (inquiry) {
                    result = await rateLimitedSummarize({
                        document: chunk,
                        inquiry,
                        onSummaryDone,
                    });
                }
                else {
                    result = await rateLimitedSummarize({
                        document: chunk,
                        onSummaryDone,
                    });
                }
                return result;
            }));
            const result = summarizedChunks.join("\n");
            console.log(result.length);
            if ((result.length + templateLength) > 4000) {
                console.log("document is STILL long and has to be shortened further");
                return await summarizeLongDocument({
                    document: result,
                    inquiry,
                    onSummaryDone,
                });
            }
            else {
                console.log("done");
                return result;
            }
        }
        else {
            return document;
        }
    }
    catch (e) {
        throw new Error(e);
    }
};
exports.default = { summarizeLongDocument };
