export class CredentialsManager {
  private apiKey: string;
  private environment: string;
  private pineconeIndex: string;

  constructor() {
    this.apiKey = process.env.PINECONE_API_KEY || "";
    this.environment = process.env.PINECONE_ENV || "";
    this.pineconeIndex = process.env.PINECONE_INDEX || "";

    this.validateCredentials();
  }

  private validateCredentials() {
    if (!this.apiKey) {
      throw new Error("PINECONE_API_KEY is undefined");
    }

    if (!this.environment) {
      throw new Error("PINECONE_ENV is undefined");
    }

    if (!this.pineconeIndex) {
      throw new Error("PINECONE_INDEX is undefined");
    }
  }

  getApiKey(): string {
    return this.apiKey;
  }

  getEnvironment(): string {
    return this.environment;
  }

  getPineconeIndex(): string {
    return this.pineconeIndex;
  }
}
