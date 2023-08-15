"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pinecone_1 = require("@pinecone-database/pinecone");
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const envPath = path_1.default.resolve(__dirname, "../../.env.local");
dotenv_1.default.config({ path: envPath });
const client = new pinecone_1.PineconeClient();
async function initializeClient() {
    await client.init({
        apiKey: process.env.PINECONE_API_KEY,
        environment: process.env.PINECONE_ENV
    });
    const pineconeIndex = client.Index(process.env.PINECONE_INDEX);
    return pineconeIndex;
}
exports.default = initializeClient;
// import { PineconeClient } from "@pinecone-database/pinecone";
// import dotenv from "dotenv";
// import path from "path";
// const envPath = path.resolve(__dirname, "../../.env.local");
// dotenv.config({ path: envPath })
// export async function initPinecone() {
//   try {
//     const pinecone = new PineconeClient();
//     await pinecone.init({
//       apiKey: process.env.PINECONE_API_KEY!,
//       environment: process.env.PINECONE_ENVIRONMENT!, 
//     });
//     console.log("Successfully initiated Pinecone")
//     return pinecone;
//   } catch (error) {
//     console.log("error", error);
//     throw new Error("Failed to initialize Pinecone Client");
//   }
// }
