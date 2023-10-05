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
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../app/config/firebase";
import { AuthContext } from "../../app/providers/AuthProvider";
import { User } from "firebase/auth";
import { RootState } from "src/app/store";
import SystemMessage from "./SystemMessage";
import MessageLoadingIndicator from "./MessageLoadingIndicator";
import ExampleQuestions from "./ExampleQuestions";
import { 
  fetchMessagesForConversation, 
  startConversation, 
  getConversation, 
  addMessageToCollection, 
  updateConversationDate 
} from "./ChatFuncs";
import { fetchProjectId } from "../../common/utils/getCurrentProjectId";
import { useSelector, useDispatch } from 'react-redux';
import { pushMessage } from './messageStackSlice'; 
import { pushAnswer, replaceLastAnswer } from './answerStackSlice'; 


const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [conversationHistory, setConversationHistory] = useState<string>("");

  const currentUser: User | null | undefined = useContext(AuthContext);

  const [activeProject, setActiveProject] = useState<string | null>(null);

  const messageStack = useSelector((state: RootState) => state.messages);
  const answerStack = useSelector((state: RootState) => state.answers);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchActiveProject = async () => {
      const projectId = await fetchProjectId(currentUser!.uid);
      setActiveProject(projectId);
    };

    fetchActiveProject();
  }, [currentUser]);

  const selectedDocuments = useSelector(
    (state: RootState) => state.library.selectedDocuments
  );

  const scrollToBottom = () => {
    if (messagesEndRef.current && messagesEndRef.current.parentElement) {
        const parentElement = messagesEndRef.current.parentElement;
        parentElement.scrollTop = parentElement.scrollHeight;
    }
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
  
        userMessages.forEach(message => {
          dispatch(pushMessage(message));
        });
  
        agentMessages.forEach(answer => {
          dispatch(pushAnswer(answer));
        });
  
        scrollToBottom();
      }
    };
    initializeMessages();
  }, [currentConversationId, dispatch]); 

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
          setCurrentConversationId(querySnapshot.docs[0].id); 
        } else {
          const newConversationId = await startConversation(currentUser.uid, activeProject!);
          setCurrentConversationId(newConversationId || null); 
        }
      }
    };

    fetchConversationId();
  }, [currentUser]);

  const handleChatAction = async (regenerate = false) => {
    try {
        setLoading(true);

        if (!regenerate) {
            dispatch(pushMessage(message));
            setMessage("");
        }

        let requestPayload;
        if (regenerate) {
            const lastSystemMessage = answerStack[answerStack.length - 1];
            requestPayload = {
                prompt: lastSystemMessage,
                option: "regenerate"
            };
        } else {
            const updatedConversationHistory = await getConversation(currentConversationId!);
            setConversationHistory(updatedConversationHistory);
            requestPayload = {
                prompt: message,
                history: updatedConversationHistory,
                option: "GeneralQa",
                files: selectedDocuments,
                userId: currentUser!.uid
            };
        }

        const res = await axios.post("http://localhost:3001/api/chat/ask", requestPayload);

        if (regenerate) {
            dispatch(replaceLastAnswer(res.data.answer));
        } else {
            dispatch(pushAnswer(res.data.answer));
            scrollToBottom();
            await addMessageToCollection(message, "user", currentConversationId, null);
            await addMessageToCollection(res.data.answer, "agent", currentConversationId, null);
            await updateConversationDate(currentConversationId!);
        }

        setLoading(false);
    } catch (error) {
        console.log(error);
    }
  };

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    handleChatAction();
  };

  const handleRegenerate = () => {
      handleChatAction(true);
  };

  function handleMessageChange(event: ChangeEvent<HTMLInputElement>): void {
    setMessage(event.target.value);
  }

  return (
    <Flex flexDir="column" flex={1} p={2} overflowY="hidden" h="100%" gap={4}>
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
