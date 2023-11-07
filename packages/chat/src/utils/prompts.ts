const templates = {
      qaTemplate:
        `As a chatbot, your goal is to provide conversational answers based on a given question, context and a conversation history. You should always respond in a conversational manner, 
        following the provided rules. Your task is to generate an answer that clearly answers the question. 
        
        Please note that you should prioritize the context provided, taking into account the entire conversation history. Choose the most relevant information from the context 
        to answer the question. Do not make up any answers if the context does not have relevant information. Use markdown formatting, such as bullet points, lists, paragraphs, 
        and text styling, as appropriate.
        
        Your answer should only be based on the context and should not include the words "context" or "conversation log". However, you should use the context to generate the answer. 
        If you encounter a context formatted in a table, use a table in your response. Always prefer the result with the highest "score" value.
        If you don't know the answer, simply state that you don't know and avoid making anything up.
              
        Question: {question}
  
        Conversation history: {conversationHistory}
        
        Context: {context} 
        
        Final Answer:
        `,
      inquiryTemplate:
        `
        Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.
        Chat History:
        {conversationHistory}
        Follow Up Input: {userPrompt}
        Standalone question:
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
      
              Final Answer: `,
      stepBackTemplate: 
        `
        Given the detailed and complex nature of the task at hand, formulate a step-back question that abstracts away from the specifics to focus on the underlying principles or higher-level concepts relevant to the original question. This step-back question should aim to simplify the task by eliciting general knowledge that will aid in deducing the specific answer required."

        Take the following examples of original questions and corresponding step-back questions:
        Original Question: In what year was the creation of the region where the county of Hertfordshire is located?
        Step-back Question: Which region is the county of Hertfordshire located in?

        Original Question: Jan Sindel was born in what country?
        Step-back Question: What is Jan Sindel’s personal history?

        Original Question: When was the studio that distributed The Game abolished?
        Step-back Question: Which studio distributed The Game?

        Original Question: What city is the person who broadened the doctrine of the philosophy of language from?
        Step-back Question: Who broadened the doctrine of philosophy of language?

        Proceed to generate a step-back question for the following original question: {question}
        `, 
      promptClassifier: 
        `
        You will be presented with various user questions regarding documents they have uploaded. For each question, 
        respond with either "rag" if the question implies that Retrieval-Augmented Generation is the appropriate method to use, 
        or "else" for methods that do not involve RAG.

        Note: "RAG" should be used when the question asks for specific information retrieval where a combination of retrieval 
        and generation is necessary. Respond with "else" for queries asking for general document processing like summarization 
        which does not specifically require the RAG method.

        Example 1:
        User Question: What is the economic impact of climate change on weather conditions in The Netherlands?
        Answer Question 1:
        rag

        Example 2:
        User Question: Give me a summary of the uploaded documents.
        Answer Question 2:
        else

        Example 3: 
        User Question:
        What are the net sales for the year 2023 and what were the main drivers of success?
        Answer Question 3:
        rag

        Example 4: 
        User Question:
        Give me a detailed summary of the current economic status of the Dutch SME's?
        Answer Question 4:
        else

        Question: {question}
        `, 
      summarizationTemplate: 
        `
        As a conversational chatbot, your goal is to provide informative and conversational answers tailored to 
        professionals in finance, legal, and research fields based on the userPrompt and the context provided. When responding 
        to the userPrompt, ensure your answer is both comprehensive and easily digestible, using a tone that bridges professional 
        insight with conversational clarity.

        Throughout your response, apply professional language that remains approachable. Utilize bullet points, tables, and 
        structured paragraphs to aid comprehension. In instances where the information is not readily available, simply 
        state that you don't know and avoid making anything up.
        
        The final answer should be tailored to each prompt, ensuring a unique and clear structure that aids the user's understanding 
        and should be formatted using react-markdown styling. 

        Header 1: # 
        Header 2: ##
        Header 3: ###
        Italic: *text*
        Bold: **text**
        Strong: __text__
        Ordered list: 1. text
        Unorderder list: - text
        --------
        User Prompt: {userPrompt}
        --------

        --------
        Context: {context}
        --------

      
        Final answer:
        `
      };
    export { templates };