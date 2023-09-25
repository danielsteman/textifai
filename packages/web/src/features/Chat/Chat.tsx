import {
  Box,
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";
import {
  useEffect,
  useRef,
  useState,
  useContext,
  ChangeEvent,
  useLayoutEffect,
} from "react";
import { MdSend } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
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
import { AuthContext } from "../../app/providers/AuthProvider";
import { User } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState } from "src/app/store";
import SystemMessage from "./SystemMessage";
import MessageLoadingIndicator from "./MessageLoadingIndicator";
import ExampleQuestions from "./ExampleQuestions";

const conversationsCollection = collection(db, "conversations");
const messagesCollection = collection(db, "messages");

const startConversation = async (
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

const addMessageToCollection = async (
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

const updateConversationDate = async (conversationId: string) => {
  try {
    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
      updatedDate: Timestamp.fromDate(new Date()),
    });
  } catch (error) {
    console.error("Error updating conversation date:", error);
  }
};

const getConversation = async (conversationId: string) => {
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

const fetchMessagesForConversation = async (conversationId: string) => {
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

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messageStack, setMessageStack] = useState<string[]>([]);
  const [answerStack, setAnswerStack] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [conversationHistory, setConversationHistory] = useState<string>("");

  const currentUser: User | null | undefined = useContext(AuthContext);

  const selectedDocuments = useSelector(
    (state: RootState) => state.library.selectedDocuments
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useLayoutEffect(() => {
    const initializeMessages = async () => {
      if (currentConversationId) {
        const messages = await fetchMessagesForConversation(
          currentConversationId
        );
        const userMessages = messages
          .filter((msg) => msg.variant === "user")
          .map((msg) => msg.messageBody);
        const agentMessages = messages
          .filter((msg) => msg.variant === "agent")
          .map((msg) => msg.messageBody);

        setMessageStack(userMessages);
        setAnswerStack(agentMessages);

        scrollToBottom();
      }
    };
    initializeMessages();
  }, [currentConversationId]);

  useLayoutEffect(scrollToBottom, [messageStack, answerStack]);

  useEffect(() => {
    const fetchConversationId = async () => {
      if (currentUser) {
        const conversationsCollection = collection(db, "conversations");
        const q = query(
          conversationsCollection,
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          setCurrentConversationId(querySnapshot.docs[0].id); // Using the value directly from querySnapshot
        } else {
          const newConversationId = await startConversation(currentUser.uid);
          setCurrentConversationId(newConversationId || null); // Using the value directly from newConversationId
        }
      }
    };

    fetchConversationId();
  }, [currentUser]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setMessageStack([...messageStack, message]);
    setMessage("");

    try {
      setLoading(true);

      // Ensure currentConversationId is not null before using it
      if (currentConversationId) {
        // Fetch the conversation history
        const updatedConversationHistory = await getConversation(
          currentConversationId!
        );
        setConversationHistory(updatedConversationHistory);
        // Now, send the updated history to the Axios server
        const res = await axios.post("http://localhost:3001/api/chat/ask", {
          prompt: message,
          history: updatedConversationHistory,
          option: "GeneralQa",
        });

        setAnswerStack([...answerStack, res.data.answer]);

        // Always scroll to bottom
        scrollToBottom();
        setLoading(false);

        // Add user's message to the collection
        await addMessageToCollection(
          message,
          "user",
          currentConversationId,
          null
        );

        // Add AI's response to the collection
        await addMessageToCollection(
          res.data.answer,
          "agent",
          currentConversationId,
          null
        );

        // Update the conversation's updatedDate
        await updateConversationDate(currentConversationId);
      } else {
        console.error("currentConversationId is null.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleRegenerate = async () => {
    // Capture the last message from answerStack
    const lastSystemMessage = answerStack[answerStack.length - 1];

    try {
      // Make the API call with the last system message
      const res = await axios.post("http://localhost:3001/api/chat/ask", {
        prompt: lastSystemMessage, // Sending the last system message
        option: "regenerate", // The option is set to "regenerate"
      });

      // Replace the last message in answerStack with the regenerated one
      setAnswerStack((prevAnswers) => {
        const updatedAnswers = [...prevAnswers];
        updatedAnswers[updatedAnswers.length - 1] = res.data.answer;
        return updatedAnswers;
      });
    } catch (error) {
      console.log(error);
    }
  };

  function handleMessageChange(event: ChangeEvent<HTMLInputElement>): void {
    setMessage(event.target.value);
  }

  return (
    <Flex flexDir="column" flex={1} p={8} overflowY="hidden" h="100%">
      <Box mb={4} overflowY="scroll" overflowX="hidden" h="100%">
        {messageStack.map((msg, index) => (
          <Box key={uuidv4()}>
            <SystemMessage message={msg} variant="user" />
            {loading && index === messageStack.length - 1 ? (
              <MessageLoadingIndicator />
            ) : (
              <>
                <SystemMessage message={answerStack[index]} variant="agent" />
                {index === answerStack.length - 1 &&
                  messageStack.length === answerStack.length && (
                    <Flex justifyContent="center" alignItems="center" py={4}>
                      <Button
                        rounded={8}
                        size="sm"
                        leftIcon={<RepeatIcon />}
                        onClick={() => handleRegenerate()}
                      >
                        Regenerate
                      </Button>
                    </Flex>
                  )}
              </>
            )}
          </Box>
        ))}
        <Box ref={messagesEndRef} />
      </Box>
      {messageStack.length === 0 && <ExampleQuestions />}
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <Input
            placeholder="Ask a question about your documents"
            onChange={handleMessageChange}
            value={message}
            autoFocus
          />
          <InputRightElement>
            <IconButton
              type="submit"
              aria-label="submit message"
              icon={<MdSend />}
              variant="ghost"
              isDisabled={message === "" || loading}
            />
          </InputRightElement>
        </InputGroup>
      </form>
    </Flex>
  );
};

export default Chat;
