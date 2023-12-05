import {
  collection,
  addDoc,
  Timestamp,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  orderBy,
  limit,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../app/config/firebase";
import { Conversation } from "@shared/interfaces/firebase/Conversation";
import { Message } from "@shared/interfaces/firebase/Message";
import { setCurrentConversationId } from "../Chat/chatSlice";
import axios from "axios";
import { config } from "../../app/config/config";
import { marked } from "marked";

export const conversationsCollection = collection(db, "conversations");
export const messagesCollection = collection(db, "messages");

export const startConversation = async (
  currentUserUid: string,
  currentProjectUid: string
): Promise<string | void> => {
  try {
    const conversationDoc: Conversation = {
      userId: currentUserUid,
      projectId: currentProjectUid,
      creationDate: Timestamp.fromDate(new Date()),
      updatedDate: Timestamp.fromDate(new Date()),
      title: "",
    };
    const conversationRef = await addDoc(
      conversationsCollection,
      conversationDoc
    );
    return conversationRef.id;
  } catch (error) {
    console.error("Error creating new conversation:", error);
  }
};

export const deleteConversation = async (
  conversationId: string,
  userId: string,
  projectId: string,
  dispatch: any
) => {
  try {
    const conversationQuery = query(
      conversationsCollection,
      where("userId", "==", userId),
      where("projectId", "==", projectId)
    );

    const snapshot = await getDocs(conversationQuery);
    const numberOfDocs = snapshot.docs.length;

    if (numberOfDocs === 1) {
      await deleteDoc(doc(conversationsCollection, conversationId));
      dispatch(setCurrentConversationId(null));
    } else if (numberOfDocs > 1) {
      await deleteDoc(doc(conversationsCollection, conversationId));
    }
  } catch (error) {
    console.error("Error removing document: ", error);
  }
};

export const addMessageToCollection = async (
  message: any,
  variant: any,
  conversationId: any,
  parentMessageId: any
) => {
  try {
    const messageDoc: Message = {
      conversationId: conversationId,
      creationDate: Timestamp.fromDate(new Date()),
      variant: variant,
      messageBody: message,
      parentMessageId: parentMessageId,
    };
    await addDoc(messagesCollection, messageDoc);
  } catch (error) {
    console.error("Error adding message to collection:", error);
  }
};

export const updateConversationDate = async (conversationId: string) => {
  try {
    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
      updatedDate: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error("Error updating conversation date:", error);
  }
};

export const getConversation = async (conversationId: string) => {
  const messagesCollection = collection(db, "messages");
  const q = query(
    messagesCollection,
    where("conversationId", "==", conversationId),
    orderBy("creationDate", "desc"),
    limit(6)
  );

  const querySnapshot = await getDocs(q);

  const lastThreeConversations: string[] = [];
  querySnapshot.docs.reverse().forEach((doc) => {
    const data = doc.data();
    const prefix = data.variant === "user" ? "USER: " : "AI: ";
    lastThreeConversations.push(prefix + data.messageBody);
  });

  return lastThreeConversations.join("\n");
};

export const fetchMessagesForConversation = async (conversationId: string) => {
  const messagesArray: { variant: string; messageBody: string }[] = [];
  const q = query(
    messagesCollection,
    where("conversationId", "==", conversationId),
    orderBy("creationDate", "asc")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    messagesArray.push({
      variant: data.variant,
      messageBody: data.messageBody,
    });
  });
  return messagesArray;
};

export const appendToDocument = async (
  currentUserUid: string,
  currentProjectUid: string,
  message: string
) => {
  try {
    const workingDocsCollection = collection(db, "workingdocuments");

    const q = query(
      workingDocsCollection,
      where("users", "array-contains", currentUserUid),
      where("projectId", "==", currentProjectUid)
    );

    const querySnapshot = await getDocs(q);

    const htmlMessage = marked(message);

    if (!querySnapshot.empty) {
      // Existing document found
      const docRef = doc(db, "workingdocuments", querySnapshot.docs[0].id);
      const currentContent = querySnapshot.docs[0].data().content || "";
      await updateDoc(docRef, {
        content: currentContent + "\n\n" + htmlMessage,
      });
    } else {
      // No document found, create a new one
      const newDocument = {
        projectId: currentProjectUid,
        name: "Document Name",
        creationDate: Timestamp.fromDate(new Date()),
        users: [currentUserUid],
        modifiedDate: Timestamp.fromDate(new Date()),
        content: htmlMessage,
      };

      await addDoc(workingDocsCollection, newDocument);
    }
  } catch (error) {
    console.error("Error appending message to document:", error);
  }
};

export const fetchConversationId = async (
  currentUserUid: string,
  currentProjectUid: string
): Promise<string | void> => {
  try {
    const conversationsCollection = collection(db, "conversations");
    const q = query(
      conversationsCollection,
      where("userId", "==", currentUserUid),
      where("projectId", "==", currentProjectUid)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const existingConversationId = querySnapshot.docs[0].id;
      return existingConversationId;
    } else {
      const newConversationId = await startConversation(
        currentUserUid,
        currentProjectUid
      );
      return newConversationId;
    }
  } catch (error) {
    console.error("Error fetching conversation ID:", error);
  }
};

export const firstMessageInConversation = async (
  conversationId: string
): Promise<boolean> => {
  const q = query(
    messagesCollection,
    where("conversationId", "==", conversationId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.empty;
};

export const setConversationTitle = async (
  firstMessage: string,
  conversationId: string
): Promise<string | void> => {
  const conversationRef = doc(conversationsCollection, conversationId);
  const conversationSnapshot = await getDoc(conversationRef);
  const conversation = conversationSnapshot.data() as Conversation;

  if (!conversation.title && conversationId) {
    const res = await axios.post(`${config.chat.url}/api/chat/title`, {
      prompt: firstMessage,
    });

    if (!res.data) {
      throw new Error(
        "Couldn't generate title based on first message in conversation."
      );
    }

    const title = res.data.text.replace(/"/g, "").trim();

    await updateDoc(conversationRef, {
      updatedDate: Timestamp.fromDate(new Date()),
      title: title,
    });

    return title;
  }
};

export const replaceLastAgentMessage = async (
  newAnswer: string,
  currentConversationId: string
) => {
  try {
    const messagesQuery = query(
      messagesCollection,
      where("conversationId", "==", currentConversationId),
      where("variant", "==", "agent"),
      orderBy("creationDate", "desc"),
      limit(1)
    );

    const querySnapshot = await getDocs(messagesQuery);

    if (!querySnapshot.empty) {
      const lastMessageDoc = querySnapshot.docs[0];
      const lastMessageRef = doc(db, "messages", lastMessageDoc.id);
      console.log(`Found message id: ${lastMessageRef}`);

      await updateDoc(lastMessageRef, {
        messageBody: newAnswer,
      });
    } else {
      console.log("No agent message found in the current conversation.");
    }
  } catch (error) {
    console.error("Error replacing the last agent message:", error);
  }
};
