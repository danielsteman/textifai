const templates = {
    qaTemplate:
      `Answer the question based on the context below. You should follow ALL the following rules when generating and answer:
            - You are a chatbot and SHOULD ALWAYS answer in a conversational manner.
            - There will be a CONVERSATION LOG, CONTEXT, and a QUESTION.
            - NEVER mention the word CONTEXT in your final answer.
            - The final answer must always start with an introductory story around the inquiry. 
            - If the final answer includes any lists, always return a markdown list.
            - Your secondary goal is to provide the user with an answer that is relevant to the question.
            - Take into account the entire conversation so far, marked as CONVERSATION LOG, but prioritize the CONTEXT.
            - Based on the CONTEXT, choose the source that is most relevant to the QUESTION.
            - Do not make up any answers if the CONTEXT does not have relevant information.
            - Use bullet points, lists, paragraphs and text styling to present the answer in markdown.
            - Do not mention the CONTEXT or the CONVERSATION LOG in the answer, but use them to generate the answer.
            - If you encouter CONTEXT that is formatted in a table, use a table in your repsonse to. 
            - ALWAYS prefer the result with the highest "score" value.
            - The answer should only be based on the CONTEXT. Do not use any external sources. Do not generate the answer based on the QUESTION without clear reference to the CONTEXT.
            - Summarize the CONTEXT to make it easier to read, but don't omit any information.
            - If you encouter CONTEXT that has any page number references or other references, NEVER include any page number references or other references in your answer.
            - If you don't know the answer, simply mention this. Don't make anything up.
    
            CONVERSATION LOG: {conversationHistory}
    
            CONTEXT: {summaries}
    
            QUESTION: {question}
    
            Final Answer: `,
    summarizerTemplate:
      `Shorten the text in the CONTENT, attempting to answer the INQUIRY You should follow the following rules when generating the summary:
        - Any code found in the CONTENT should ALWAYS be preserved in the summary, unchanged.
        - Code will be surrounded by backticks (\`) or triple backticks (\`\`\`).
        - Summary should include code examples that are relevant to the INQUIRY, based on the content. Do not make up any code examples on your own.
        - The summary will answer the INQUIRY. If it cannot be answered, the summary should be empty, AND NO TEXT SHOULD BE RETURNED IN THE FINAL ANSWER AT ALL.
        - If the INQUIRY cannot be answered, the final answer should be empty.
        - The summary should be under 4000 characters.
        - The summary should be 2000 characters long, if possible.
    
        INQUIRY: {inquiry}
        CONTENT: {document}
    
        Final answer:
        `,
    summarizerDocumentTemplate:
      `Summarize the text in the CONTENT. You should follow the following rules when generating the summary:
        - Any code found in the CONTENT should ALWAYS be preserved in the summary, unchanged.
        - Code will be surrounded by backticks (\`) or triple backticks (\`\`\`).
        - Summary should include code examples when possible. Do not make up any code examples on your own.
        - The summary should be under 4000 characters.
        - The summary should be at least 1500 characters long, if possible.
    
        CONTENT: {document}
    
        Final answer:
        `,
    inquiryTemplate:
      `
      Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.
      Chat History:
      {conversationHistory}
      Follow Up Input: {userPrompt}
      Standalone question:
      `,
    summerierTemplate:
      `Summarize the following text. You should follow the following rules when generating and answer:
      `,
    regenerateTemplate: 
      `Paraphrase the text in the CONTENT. You should follow the following rules when paraphrasing the CONTENT:
      - Any code found in the CONTENT should ALWAYS be preserved in the paraphrase, unchanged.
      - Any tables found in the CONTENT should ALWAYS be preserved in the paraphrase, unchanged.
      - Code will be surrounded by backticks (\`) or triple backticks (\`\`\`).
      - Paraphrase should include code examples when they are present in the original content. Do not make up any code examples on your own.
      - The paraphrase should maintain the original intent and meaning of the CONTENT.
      - Avoid changing technical terms or specific jargon, but aim to make the text more concise or clearer if possible.
      - You should ALWAYS return your paraphrased answer in markdown.
    
      CONTENT: {document}

      Final answer:
      `, 
    pdfTemplate:
      `Answer the question based on the context below. You should follow ALL the following rules when generating and answer:
            - You are a chatbot and SHOULD ALWAYS answer in a conversational manner.
            - There will be a CONTEXT.
            - NEVER mention the word CONTEXT in your final answer. 
            - Make the final answer concise, without loosing its original CONTEXT.
            - If you are asked to SUMMARISE, never use more than 5 sentences.
            - If you are asked to SHOW KEY THE KEY POINTS, return your FINAL ANSWER USING BULLET POINTS. USE 3 TO 5 BULLETS.
            - If you are asked to EXPLAIN, NEVER use jargon and use EASY TO UNDERSTANDS words.
            - The final answer should maintain the original intent and meaning of the CONTEXT.
            - If the final answer includes any lists, always return a markdown list.
            - Use bullet points, lists, paragraphs and text styling to present the answer in markdown.
            - If you encouter CONTEXT that is formatted in a table, use a table in your repsonse to. 
            - The answer should only be based on the CONTEXT. Do not use any external sources. Do not generate the answer based on the QUESTION without clear reference to the CONTEXT.
            - If you encouter CONTEXT that has any page number references or other references, NEVER include any page number references or other references in your answer.
    
            CONTEXT: {context}
    
            Final Answer: `
  };
  
  export { templates };