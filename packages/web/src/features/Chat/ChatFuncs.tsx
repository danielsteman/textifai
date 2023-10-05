
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
  } from "firebase/firestore";
  import { db } from "../../app/config/firebase";
  import { Conversation } from "@shared/firestoreInterfaces/Conversation";
  import { Message } from "@shared/firestoreInterfaces/Message";
  import { useDispatch } from 'react-redux';
  import axios from 'axios';
  import { pushAnswer } from './answerStackSlice'; 
  import { pushMessage } from './messageStackSlice'; 

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

    if (!querySnapshot.empty) {
      // Existing document found
      const docRef = doc(db, "workingdocuments", querySnapshot.docs[0].id);
      const currentContent = querySnapshot.docs[0].data().content || "";
      await updateDoc(docRef, {
        content: currentContent + "\n\n" + message
      });
    } else {
      // No document found, create a new one
      const newDocument = {
        projectId: currentProjectUid,
        name: "Document Name",  
        creationDate: Timestamp.fromDate(new Date()),
        users: [currentUserUid],
        modifiedDate: Timestamp.fromDate(new Date()),
        content: message 
      };
      
      await addDoc(workingDocsCollection, newDocument);
    }
  } catch (error) {
    console.error("Error appending message to document:", error);
  }
};

export const handleSendPdfText = async (pdfText: string, currentConversationId: string | null, setLoading: (loading: boolean) => void, dispatch: any) => {
  try {
      setLoading(true);

      dispatch(pushMessage(pdfText));

      // Constructing the payload
      const requestPayload = {
          prompt: pdfText,
          option: 'pdfqa',
      };

      const res = await axios.post("http://localhost:3001/api/chat/ask", requestPayload);

      dispatch(pushAnswer(res.data.answer));
      await addMessageToCollection(pdfText, "user", currentConversationId, null);
      await addMessageToCollection(res.data.answer, "agent", currentConversationId, null);
      await updateConversationDate(currentConversationId!);

      setLoading(false);
  } catch (error) {
      console.log(error);
  }
};
