"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pinecone_1 = require("@pinecone-database/pinecone");
const client = new pinecone_1.PineconeClient();
async function initializeClient() {
    await client.init({
        apiKey: "73144a3a-1736-4c50-a992-8fb87cdeacb0",
        environment: "northamerica-northeast1-gcp"
    });
    const pineconeIndex = client.Index("textifai");
    return pineconeIndex;
}
exports.default = initializeClient;
