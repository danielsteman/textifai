import { PromptTemplate } from "langchain/prompts";

const kbQuestionPromptTemplate = `Use the following portion of a long document to see if any of the text is relevant to answer the question.

{context}
Question: {question}
Relevant text, if any:`;

const KB_QUESTION_PROMPT = new PromptTemplate({
    template: kbQuestionPromptTemplate, 
    inputVariables: ["context", "question"]
});

const kbCombinePromptTemplate = `
You are a professional research assistant and reacts to questions in a professional manner.

Given the following extracted parts of a scientific paper and a question.
If you don't know the answer, just say that you don't know. Don't try to make up an answer.

QUESTION: {question}
=========
{summaries}
=========
FINAL ANSWER:`;

export const KB_COMBINE_PROMPT = new PromptTemplate({
    template: kbCombinePromptTemplate, 
    inputVariables: ["summaries", "question"]
});