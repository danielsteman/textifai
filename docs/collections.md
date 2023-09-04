# User journey

## Useful docs

https://firebase.google.com/docs/firestore/data-model

## Relationships (for now)

One user can have multiple projects. (users/{userId}/{projectId}/uploads/{fileName}.pdf)
One project can have multiple users.
One project has one library.

In the future, we could [combine vector stores](https://python.langchain.com/docs/modules/agents/how_to/agent_vectorstore)

## New user

User signs up > project creation page > create project > workspace home > upload document call to action

```ts
interface UserAccount {
  userId: string;
  avatarUrl: string;
  createdDate: Date;
  updatedDate: Date;
  language: string;
  isActive: boolean;
  adminForProjects: string[];
  projects: string[];
}
```

### Create project

Create new `project` in firestore in `projects` collection.

```ts
interface Project {
  projectId: string;
  name: string;
  description: string;
  industry: string[];
  users: User[];
  creationDate: Date;
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
  creationDate: Date;
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
  creationDate: Date;
  updatedDate: Date;
}
```

Send each message to `messages` collection.

```ts
interface Message {
  messageId: string;
  conversationId: string;
  creationDate: Date;
  variant: "user" | "agent";
  messageBody: string;
  parentMessageId?: string;
}
```

## Existing user

User logs in > workspace home
