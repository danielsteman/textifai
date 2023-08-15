"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pinecone_1 = require("@pinecone-database/pinecone");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envPath = path_1.default.resolve(__dirname, "../.env.local");
dotenv_1.default.config({ path: envPath });
console.log(process.env.PINECONE_ENV);
if (!process.env.PINECONE_ENV || !process.env.PINECONE_API_KEY) {
    throw new Error("Pinecone environment or API key vars missing");
}
async function initializeClient() {
    try {
        const client = new pinecone_1.PineconeClient();
        await client.init({
            apiKey: process.env.PINECONE_API_KEY,
            environment: process.env.PINECONE_ENV,
        });
        const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
        return pineconeIndex;
    }
    catch (error) {
        console.error("An error occurred while initializing the Pinecone client:", error);
        throw new Error("Failed to initialize Pinecone Client");
    }
}
exports.default = initializeClient;
