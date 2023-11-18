import React, { useContext, useEffect, useState } from "react";
import { Conversation } from "@shared/interfaces/firebase/Conversation";
import { QueryDocumentSnapshot, collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { AuthContext } from "./AuthProvider";
import LoadingScreen from "../../common/components/LoadingScreen";
import { RootState } from "../store";
import { useSelector } from "react-redux";

interface Props {
  children: React.ReactNode;
}

interface ExtendedConversation extends Conversation {
  uid: string;
}

export const ConversationContext = React.createContext<ExtendedConversation[]>([]);

export const ConversationProvider: React.FC<Props> = ({ children }) => {
  const [conversations, setConversations] = useState<ExtendedConversation[]>([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useContext(AuthContext);
  const activeProjectId = useSelector(
    (state: RootState) => state.activeProject.projectId
  );

  useEffect(() => {
    if (currentUser) {
      const conversationsRef = collection(db, "conversations");
      const conversationsQuery = query(
        conversationsRef,
        where("userId", "==", currentUser.uid),
        where("projectId", "==", activeProjectId)
      );

      const unsubscribe = onSnapshot(conversationsQuery, (snapshot) => {
        const fetchedConversations: ExtendedConversation[] = [];
        snapshot.forEach((doc: QueryDocumentSnapshot) => {
          const conversationData = doc.data() as Conversation;
          fetchedConversations.push({ ...conversationData, uid: doc.id });
        });
        setConversations(fetchedConversations);
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [currentUser, activeProjectId]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ConversationContext.Provider value={conversations}>
      {children}
    </ConversationContext.Provider>
  );
};
