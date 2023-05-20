# MVP

To be able to pitch Textifai, there should be a tangible product that cover basic features. The below list represents the least features that need to be included in the MVP.

## Features

Features are divided in sub sections.

### Authentication

Users can sign up and login using:

- Email address and password
- Google
- Facebook

### File uploads

Users can upload files which they can use in some way..?

### Data sources (read)

The app integrates with several data sources to make it smarter. For example, the app get data from:

- Documents that have been uploaded by the user
- Documents from Google Docs of the user, if the user gave permission to do so
- Some other third party data stores..?

### Data analyses

Through the web app, users can select a document that they uploaded earlier and perform the following analyses:

- Store documents in vector database
  - Function app that is triggered on every document upload. The function app should extract the content of the document (probably text), use a text embeddings function (probably OpenAI embeddings endpoint) and write the vectors to a vector database (probably ChromaDB).
  - The same function app can be used but has to be triggered by the user who selects which documents should be processed for further analyses.
  - Process texts from third party sources
- Summarisation of the complete document
  - This can also be done very easily with a Firebase function app, triggered whenever a document enters the firestore database.
- Users will want to interact their documents through each document vector. This could be considered the inference part.
  - Find similar text from the vector database that contains vectorized documents from the sources [listed above](#data-sources)

### Output (write)

After performing analyses, the user might want to store the output somewhere...
