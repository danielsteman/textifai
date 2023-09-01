# User journey

## Relationships (for now)

One user can have multiple projects. (users/{userId}/{projectId}/uploads/{fileName}.pdf)
One project can have multiple users.
One project has one library.

In the future, we could [combine vector stores](https://python.langchain.com/docs/modules/agents/how_to/agent_vectorstore)

## New user

User signs up > project creation page > create project > workspace home > upload document call to action

### Sign up

Done

### Create project

Create new `project` in firestore in `projects` collection.

```ts
interface User {
  userId: string;
  admin: boolean;
}
```

```ts
interface Project {
  projectId: string;
  name: string;
  description: string;
  industry: string[];
  users: User[];
  creationDate: timestamp;
}
```

### Workspace home

Personal dashboard in Figma, where most components are empty

### Upload new documents

New user starts uploading documents. Each document has metadata in `uploads` collection:

```ts
interface Document {
  documentId: string;
  projectId: string;
  uploadedBy: string;
  fileName: string;
  author: string;
  creationDate: timestamp;
  uploadDate: timestamp;
  summary: string;
  topics: string[];
  tags: string[];
  fileSize: number;
  wordCount: number;
  extractedText: string;
  favoritedBy: string[];
}
```

### Start new chat

New user opens a chat to ask questions about the uploaded documents. Create conversation in `conversations` collection.

```ts
interface Conversation {
  conversationId: string;
  userId: string;
  projectId: string;
  creationDate: timestamp;
}
```

Send each message to `messages` collection.

```ts
interface Message {
  messageId: string;
  conversationId: string;
  creationDate: timestamp;
  variant: "user" | "agent";
  messageBody: string;
  agentMessageId?: string;
  userMessageId?: string;
}
```

## Existing user

User logs in > workspace home
