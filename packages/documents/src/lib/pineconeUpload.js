"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFile = void 0;
const text_splitter_1 = require("langchain/text_splitter");
const openai_1 = require("langchain/embeddings/openai");
const pinecone_1 = require("langchain/vectorstores/pinecone");
const pinecone_2 = require("@pinecone-database/pinecone");
const pdf_1 = require("langchain/document_loaders/fs/pdf");
const apiKey = import.meta.env.VITE_PINECONE_API_KEY;
const environment = import.meta.env.VITE_PINECONE_ENV;
const pineconeIndex = import.meta.env.VITE_PINECONE_INDEX;
if (!apiKey || !environment || !pineconeIndex) {
    console.error("Missing environment variables");
    throw new Error("Failed to initialize Pinecone Client due to missing environment variables");
}
function initializeClient() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new pinecone_2.PineconeClient();
            yield client.init({
                apiKey,
                environment,
            });
            return client.Index(pineconeIndex);
        }
        catch (error) {
            console.error("An error occurred while initializing the Pinecone client:", error);
            throw new Error("Failed to initialize Pinecone Client");
        }
    });
}
function readPDFFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(new Error("Failed to read file"));
            reader.readAsArrayBuffer(file);
        });
    });
}
function processFile(file) {
    return __awaiter(this, void 0, void 0, function* () {
        const index = yield initializeClient();
        let rawDoc;
        try {
            console.log("Starting to load PDF document.");
            const fileContent = yield readPDFFile(file);
            // Modify the PDFLoader to accept content (ArrayBuffer or any appropriate format)
            // const loader = new PDFLoader(fileContent);
            // rawDoc = await loader.load();
            // Here, you should replace this line with your logic for loading the PDF content
            const loader = new pdf_1.PDFLoader(file);
            rawDoc = yield loader.load();
            console.log("PDF document loaded successfully.");
        }
        catch (error) {
            console.error("Failed to read document:", error);
            throw new Error("Failed to read document");
        }
        let docs;
        try {
            console.log("Starting to split document into chunks.");
            const textSplitter = new text_splitter_1.RecursiveCharacterTextSplitter({
                chunkSize: 1000,
                chunkOverlap: 200,
            });
            docs = yield textSplitter.splitDocuments(rawDoc);
            console.log(`Document successfully split into ${docs.length} chunks.`);
        }
        catch (error) {
            console.error("Failed to chunk document:", error);
            throw new Error("Failed to chunk document");
        }
        try {
            console.log("Starting to create and store embeddings.");
            const embeddings = new openai_1.OpenAIEmbeddings({
                openAIApiKey: import.meta.env.OPENAI_API_KEY,
                modelName: "text-embedding-ada-002",
            });
            console.log("OpenAI client initialized.");
            // Embed the PDF documents
            yield pinecone_1.PineconeStore.fromDocuments(docs, embeddings, {
                pineconeIndex: index,
                textKey: "text",
            });
            console.log("Embeddings successfully stored in vector store.");
        }
        catch (error) {
            console.error("Failed to embed data in the vector store:", error);
            throw new Error("Failed to embed data in the vector store");
        }
    });
}
exports.processFile = processFile;
