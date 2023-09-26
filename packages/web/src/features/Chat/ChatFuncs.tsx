
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
    DocumentData,
  } from "firebase/firestore";
  import { db } from "../../app/config/firebase";
  import { Conversation } from "@shared/firestoreInterfaces/Conversation";
  import { Message } from "@shared/firestoreInterfaces/Message";

export const conversationsCollection = collection(db, "conversations");
export const messagesCollection = collection(db, "messages");

export const startConversation = async (
  currentUserUid: string
): Promise<string | void> => {
  try {
    const conversationDoc: Conversation = {
      userId: currentUserUid,
      projectId: "currentProject", // TO DO --> Make dynamic
      creationDate: Timestamp.fromDate(new Date()),
      updatedDate: Timestamp.fromDate(new Date()),
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

export const appendToDocument = async (currentUserUid: string, message: string) => {
  try {
    const workingDocsCollection = collection(db, "workingdocuments");
    
    const q = query(
      workingDocsCollection, 
      where("users", "array-contains", currentUserUid),
      /// where("projectId", "==", projectId) // TO DO
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const docRef = doc(db, "workingdocuments", querySnapshot.docs[0].id);
      const currentContent = querySnapshot.docs[0].data().content || "";
      await updateDoc(docRef, {
        content: currentContent + "\n\n" + message
      });
    } else {
      console.error("No matching document found.");
    }
  } catch (error) {
    console.error("Error appending message to document:", error);
  }
}
