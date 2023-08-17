"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMatchesFromEmbeddings = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const pinecone_1 = require("./pinecone");
const envPath = path_1.default.resolve(__dirname, "../../.env.local");
dotenv_1.default.config({ path: envPath });
const getMatchesFromEmbeddings = async (embeddings, topK) => {
    var _a;
    const index = await (0, pinecone_1.initializeClient)();
    const queryRequest = {
        vector: embeddings,
        topK,
        includeMetadata: true,
    };
    try {
        const queryResult = await index.query({
            queryRequest,
        });
        return (((_a = queryResult.matches) === null || _a === void 0 ? void 0 : _a.map((match) => (Object.assign(Object.assign({}, match), { metadata: match.metadata })))) || []);
    }
    catch (e) {
        console.log("Error querying embeddings: ", e);
        throw new Error(`Error querying embeddings: ${e}`);
    }
};
exports.getMatchesFromEmbeddings = getMatchesFromEmbeddings;
