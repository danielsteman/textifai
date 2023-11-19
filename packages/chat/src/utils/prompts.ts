const templates = {
  qaTemplate: `As a chatbot, your goal is to provide conversational answers based on a given question, context and a conversation history. You should always respond in a conversational manner,
        following the provided rules. Your task is to generate an answer that clearly answers the question.

        Please note that you should prioritize the context provided, taking into account the entire conversation history. Choose the most relevant information from the context
        to answer the question. Do not make up any answers if the context does not have relevant information. Use markdown formatting, such as bullet points, lists, paragraphs,
        and text styling, as appropriate.

        Markdown styling:
            Header 1: #
            Header 2: ##
            Header 3: ###
            Italic: *text*
            Bold: **text**
            Strong: __text__
            Ordered list: 1. text
            Unorderder list: - text
            New line: \

        Your answer should only be based on the context and should not include the words "context" or "conversation log". However, you should use the context to generate the answer.
        If you encounter a context formatted in a table, use a table in your response. Always prefer the result with the highest "score" value.
        If you don't know the answer, simply state that you don't know and avoid making anything up.

        Question: {question}

        Conversation history: {conversationHistory}

        Context: {context}

        Final Answer:
        `,
  inquiryTemplate: `
        Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question, in its original language.
        Chat History:
        {conversationHistory}
        Follow Up Input: {userPrompt}
        Standalone question:
        `,
  regenerateTemplate: `
      Paraphrase the given text, preserving any code or tables that are present. Your paraphrase should maintain the original intent and
      meaning of the text, while also aiming to improve clarity and conciseness where possible. Please provide your paraphrased answer in markdown format.

      CONTENT: {document}

      Your paraphrased answer should be provided below:
        `,
  pdfTemplate: `
      Based on the given context, you are a chatbot tasked with answering questions in a conversational manner while following specific rules.
      Your answers should be concise, maintaining the original context, and avoiding the mention of the word "context".
      If asked to summarize, use no more than five sentences. If asked to show key points, use three to five bullet points.
      If asked to explain, use easy-to-understand language without jargon. Your final answer should be based solely on the given
      context and should not reference any external sources or use page number references.

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
      New line: \

      --------
      Context: {context}
      --------

      Final answer:

  `,
  stepBackTemplate: `
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
  promptClassifier: `
        You will be presented with various user questions regarding documents they have uploaded. For each question,
        respond with either "rag" if the question implies that Retrieval-Augmented Generation is the appropriate method to use,
        "summarize" questions regarding summarization of (parts of) documents or "vanilla" for methods that do not involve RAG or summarization.

        Note: "rag" should be used when the question asks for specific information retrieval where a combination of retrieval
        and generation is necessary. Respond with "summarize" for queries asking summarization which does not specifically require the RAG method.
        If the question is neither regarding "rag" or "summarize", respond with "vanilla".
        This always applies: respond with either the word "rag", "summarize" or "vanilla.

        Example 1:
        User Question: What is the economic impact of climate change on weather conditions in The Netherlands?
        Answer Question 1:
        rag

        Example 2:
        User Question: Give me a summary of the uploaded documents.
        Answer Question 2:
        summarize

        Example 3:
        User Question:
        What are the net sales for the year 2023 and what were the main drivers of success?
        Answer Question 3:
        rag

        Example 4:
        User Question:
        Give me a detailed summary of the current economic status of the Dutch SME's?
        Answer Question 4:
        summarize

        Example 5:
        User Question:
        How are you today?
        Answer Question 5:
        vanilla

        Example 6:
        User Question:
        What is one plus one?
        Answer Question 5:
        vanilla

        Question: {question}
        `,
  summarizationTemplate: `
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
        New line: \
        --------
        User Prompt: {userPrompt}
        --------

        --------
        Context: {context}
        --------

        Final answer:
        `,
  conversationTitleTemplate: `
        As an AI, your task is to generate a concise and meaningful title that captures the essence of the conversation based
        on the initial userPrompt. This title should reflect the core topic or question raised in the first message of the conversation,
        providing a clear and engaging overview of what the conversation will be about.

        Instructions:
        1. Read and analyze the initial userPrompt carefully to understand the main topic or question being addressed.
        2. Create a title that succinctly encapsulates the central theme or key issue presented in the userPrompt.
        3. The title must be concise, engaging, and accurately reflective of the conversation's subject matter.
        4. Always aim to return a title that is not longer than 5 words

        Remember, the title should be broad enough to encompass the possible directions the conversation could take but specific enough to
        give a clear idea of the main topic.

        Process the following information to create the title:

        --------
        User Prompt: {userPrompt}
        --------

        Generated Title:
        `,
};
export { templates };
