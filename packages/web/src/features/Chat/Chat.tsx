import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SkeletonCircle,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { RepeatIcon, PlusSquareIcon } from "@chakra-ui/icons";
import React, { useEffect, useRef, useState, useContext, ChangeEvent, useLayoutEffect } from "react";
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

type SystemMessageProps = {
  message: string;
};

const conversationsCollection = collection(db, "conversations");
const messagesCollection = collection(db, "messages");

const startConversation = async (currentUserUid: string): Promise<string | void> => {
  try {
    const conversationDoc: Conversation = {
      userId: currentUserUid,  
      projectId: "currentProject", // TO DO --> Make dynamic 
      creationDate: Timestamp.fromDate(new Date()),
      updatedDate: Timestamp.fromDate(new Date()),
    };
    const conversationRef = await addDoc(conversationsCollection, conversationDoc);
    return conversationRef.id;
  } catch (error) {
    console.error("Error creating new conversation:", error);
  }
};

const addMessageToCollection = async (message: any, variant: any, conversationId: any, parentMessageId: any) => {
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
  querySnapshot.docs.reverse().forEach(doc => {
    const data = doc.data();
    const prefix = data.variant === 'user' ? 'USER: ' : 'AI: ';
    lastThreeConversations.push(prefix + data.messageBody);
  });

  return lastThreeConversations.join('\n');
};

const fetchMessagesForConversation = async (conversationId: string) => {
  const messagesArray: { variant: string; messageBody: string }[] = [];
  const q = query(
    messagesCollection,
    where("conversationId", "==", conversationId),
    orderBy("creationDate", "asc")
  );
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach(doc => {
    const data = doc.data();
    messagesArray.push({
      variant: data.variant,
      messageBody: data.messageBody
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
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [conversationHistory, setConversationHistory] = useState<string>("");

  const currentUser: User | null | undefined = useContext(AuthContext);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch past messages
  useLayoutEffect(() => {
    const initializeMessages = async () => {
      if (currentConversationId) {
        const messages = await fetchMessagesForConversation(currentConversationId);
        const userMessages = messages
          .filter(msg => msg.variant === "user")
          .map(msg => msg.messageBody);
        const agentMessages = messages
          .filter(msg => msg.variant === "agent")
          .map(msg => msg.messageBody);
        
        setMessageStack(userMessages);
        setAnswerStack(agentMessages);

        // Always scroll to bottom
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
        const q = query(conversationsCollection, where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);
  
        if (!querySnapshot.empty) {
          setCurrentConversationId(querySnapshot.docs[0].id);
          console.log("Current conversationId: ", querySnapshot.docs[0].id); // Using the value directly from querySnapshot
        } else {
          // No existing conversation found for this user, so let's start a new one.
          const newConversationId = await startConversation(currentUser.uid);
          setCurrentConversationId(newConversationId || null);
          console.log("Current conversationId: ", newConversationId || null); // Using the value directly from newConversationId
        }
      }
    };
  
    fetchConversationId();
  }, [currentUser]);
  

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setMessageStack([...messageStack, message]);
    setMessage("");

    try {
        setLoading(true);

        // Ensure currentConversationId is not null before using it
        if (currentConversationId) {
            // Fetch the conversation history
            const updatedConversationHistory = await getConversation(currentConversationId!);
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
            await addMessageToCollection(message, "user", currentConversationId, null);

            // Add AI's response to the collection
            await addMessageToCollection(res.data.answer, "agent", currentConversationId, null);

            // Update the conversation's updatedDate
            await updateConversationDate(currentConversationId);
        } else {
            console.error("currentConversationId is null.");
        }  
    } catch (error) {
        console.log(error);
    }
  };

  const handleRegenerate = async (option: string, originalMessage: string) => {
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

  const SystemMessage = ({ message }: SystemMessageProps) => {
    const [menuClicked, setMenuClicked] = useState(false); // Add state to track menu click

    return (
      <Flex align="left" justifyContent="flex-start" flexDirection="column">
        <Box
          display="flex"
          alignItems="center"
          bgColor="pink"
          p={1}
          px={8}
          rounded={8}
          position="relative"
        >
          <Text whiteSpace="pre-line">{message}</Text>
          {!menuClicked && ( // Conditionally render menu based on state
            <Box position="absolute" right={2} top={0}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<PlusSquareIcon />} // Use the new icon
                  variant="ghost"
                  size="sm"
                />
                <MenuList>
                  <MenuItem
                    onClick={() => {
                      setMenuClicked(true); /* Your logic here */
                    }}
                  >
                    Copy to Working Document
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      setMenuClicked(true); /* Your logic here */
                    }}
                  >
                    Show in Source Document
                  </MenuItem>
                </MenuList>
              </Menu>
            </Box>
          )}
        </Box>
      </Flex>
    );
  };

  function handleMessageChange(event: ChangeEvent<HTMLInputElement>): void {
    setMessage(event.target.value);
}

  return (
    <Flex flexDir="column" flex={1} p={8} overflowY="hidden" h="100%">
      <Box mb={4} overflowY="scroll" overflowX="hidden" h="100%">
        {messageStack.map((msg, index) => (
          <Box key={uuidv4()} py={2}>
            <Flex mb={2}>
              <Spacer />
              <Text bgColor="teal" p={1} px={4} rounded={4}>
                {msg}
              </Text>
            </Flex>
            {loading && index === messageStack.length - 1 ? (
              <HStack>
                <SkeletonCircle size="2" />
                <SkeletonCircle size="2" />
                <SkeletonCircle size="2" />
              </HStack>
            ) : (
              <>
                <SystemMessage message={answerStack[index]} />
                {index === answerStack.length - 1 &&
                  messageStack.length === answerStack.length && (
                    <Flex justifyContent="center" alignItems="center" py={4}>
                      <Button
                        leftIcon={<RepeatIcon />}
                        onClick={() => handleRegenerate("regenerate", message)}
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
      {messageStack.length === 0 && (
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          mb={4}
          pb={6}
        >
          <HStack mb={2}>
            <Button
              onClick={() => {
                /* Your logic here */
              }}
            >
              Sample Question 1
            </Button>
            <Button
              onClick={() => {
                /* Your logic here */
              }}
            >
              Sample Question 2
            </Button>
          </HStack>
          <HStack>
            <Button
              onClick={() => {
                /* Your logic here */
              }}
            >
              Sample Question 3
            </Button>
            <Button
              onClick={() => {
                /* Your logic here */
              }}
            >
              Sample Question 4
            </Button>
          </HStack>
        </Flex>
      )}
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
              aria-label="Ask question about your documents"
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