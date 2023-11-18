import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Tooltip,
  useColorMode,
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
import { AuthContext } from "../../app/providers/AuthProvider";
import { User } from "firebase/auth";
import { RootState } from "../../app/store";
import SystemMessage from "./SystemMessage";
import MessageLoadingIndicator from "./MessageLoadingIndicator";
import {
  getConversation,
  addMessageToCollection,
  updateConversationDate,
  fetchConversationId,
  fetchMessagesForConversation,
  setConversationTitle,
} from "./ChatFuncs";
import { useSelector, useDispatch } from "react-redux";
import { clearMessages, pushMessage, setMessages } from "./messageStackSlice";
import {
  clearAnswers,
  pushAnswer,
  replaceLastAnswer,
  setAnswers,
} from "./answerStackSlice";
import { setCurrentConversationId, setLoading } from "./chatSlice";
import { config } from "../../app/config/config";
import theme from "../../app/themes/theme";

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const lastProcessedTextRef = useRef<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [randomQuestions, setRandomQuestions] = useState<string[]>([]);

  const [answerStreamComplete, setAnswerStreamComplete] =
    useState<boolean>(true);

  const [answerStream, setAnswerStream] = useState<string>("");

  const currentUser: User | null | undefined = useContext(AuthContext);
  const { colorMode } = useColorMode();

  const messageStack = useSelector((state: RootState) => state.messages);
  const answerStack = useSelector((state: RootState) => state.answers);
  const selectedText = useSelector(
    (state: RootState) => state.pdf.selectedText
  );
  const currentConversationId = useSelector(
    (state: RootState) => state.chat.currentConversationId
  );
  const activeProjectId = useSelector(
    (state: RootState) => state.activeProject.projectId
  );
  const loading = useSelector((state: RootState) => state.chat.loading);

  const dispatch = useDispatch();

  useEffect(() => {
    if (messageStack.length === 1) {
      setConversationTitle(messageStack[0], currentConversationId!);
    }
  }, [messageStack]);

  useEffect(() => {
    const initializeMessages = async () => {
      if (currentConversationId) {
        const messages = await fetchMessagesForConversation(
          currentConversationId!
        );
        const userMessages = messages
          .filter((msg) => msg.variant === "user")
          .map((msg) => msg.messageBody);
        const agentMessages = messages
          .filter((msg) => msg.variant === "agent")
          .map((msg) => msg.messageBody);

        dispatch(setMessages(userMessages));
        dispatch(setAnswers(agentMessages));
      } else {
        dispatch(clearMessages());
        dispatch(clearAnswers());
      }
    };
    initializeMessages();
  }, [currentConversationId]);

  useEffect(() => {
    if (isProcessing) return;

    if (selectedText && selectedText !== lastProcessedTextRef.current) {
      setIsProcessing(true);
      handleSubmit({ preventDefault: () => {} });
    }
  }, [selectedText, isProcessing]);

  const selectedDocuments = useSelector(
    (state: RootState) => state.library.selectedDocuments
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useLayoutEffect(scrollToBottom, [messageStack, answerStack, dispatch]);

  useEffect(() => {
    const getConversationId = async () => {
      if (currentUser && activeProjectId) {
        const conversationId = await fetchConversationId(
          currentUser.uid,
          activeProjectId
        );
        if (conversationId) {
          dispatch(setCurrentConversationId(conversationId));
        }
      }
    };

    getConversationId();
  }, [currentUser, activeProjectId, dispatch]);

  const handleStreamingAnswer = async (requestPayload: any) => {
    setMessage("");
    setAnswerStream("");

    const response = await fetch(`${config.chat.url}/api/chat/rag`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestPayload),
    });

    if (!response.ok || !response.body) {
      throw new Error(
        `Error fetching response from RAG chain, HTTP code: ${response.status}`
      );
    }

    const reader = response.body.getReader();

    dispatch(setLoading(false));
    setAnswerStreamComplete(false);

    let accumulatedAnswerStream = "";

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      const text = new TextDecoder().decode(value);
      setAnswerStream((prev): string => `${prev}${text}`);
      accumulatedAnswerStream += text;
    }

    scrollToBottom();
    setAnswerStreamComplete(true);

    await addMessageToCollection(message, "user", currentConversationId, null);
    await addMessageToCollection(
      accumulatedAnswerStream,
      "agent",
      currentConversationId,
      null
    );
    await updateConversationDate(currentConversationId!);

    return accumulatedAnswerStream;
  };

  const handleChatAction = async (
    regenerate = false,
    pdfText?: string,
    exampleQuestion?: string
  ) => {
    try {
      dispatch(setLoading(true));

      if (pdfText) {
        console.log("Handling PdfQa Chain...");

        dispatch(pushMessage(message));

        const requestPayload = {
          promptFromExtract: pdfText,
        };

        const answer = await handleStreamingAnswer(requestPayload);
        dispatch(pushAnswer(answer));
      } else if (regenerate) {
        console.log("Handling Regenerate Chain...");

        const lastSystemMessage = answerStack[answerStack.length - 1];

        const requestPayload = {
          prompt: lastSystemMessage,
          regenerate: true,
        };

        const answer = await handleStreamingAnswer(requestPayload);

        console.log(`Regenerated answer: ${answer}`);

        dispatch(replaceLastAnswer(answer));
      } else if (exampleQuestion) {
        dispatch(pushMessage(exampleQuestion));
        const requestPayload = {
          prompt: exampleQuestion,
          history: "",
          files: selectedDocuments,
          userId: currentUser!.uid,
        };

        const answer = await handleStreamingAnswer(requestPayload);
        dispatch(pushAnswer(answer));
      } else {
        console.log("Handling Regular Chain...");

        dispatch(pushMessage(message));

        const updatedConversationHistory = await getConversation(
          currentConversationId!
        );

        const requestPayload = {
          prompt: message,
          history: updatedConversationHistory,
          files: selectedDocuments,
          userId: currentUser!.uid,
        };

        const answer = await handleStreamingAnswer(requestPayload);
        dispatch(pushAnswer(answer));
      }

      dispatch(setLoading(false));
    } catch (error) {
      dispatch(setLoading(false));
      console.error("Error in handleChatAction:", error);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    console.log("handleSubmit called");
    e.preventDefault();

    if (selectedText && selectedText !== lastProcessedTextRef.current) {
      await handleChatAction(false, selectedText);
      lastProcessedTextRef.current = selectedText;
    } else {
      await handleChatAction();
    }

    setIsProcessing(false);
  };

  const handleRegenerate = () => {
    handleChatAction(true);
  };

  function handleMessageChange(event: ChangeEvent<HTMLInputElement>): void {
    setMessage(event.target.value);
  }

  const pickRandomQuestions = (
    questions: string[],
    count: number | undefined
  ) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const allSampleQuestions = useSelector(
    (state: RootState) => state.sampleQuestions
  );

  useEffect(() => {
    setRandomQuestions(pickRandomQuestions(allSampleQuestions, 4));
  }, []);

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
                {index === messageStack.length - 1 ? (
                  <>
                    <SystemMessage
                      message={
                        answerStreamComplete ? answerStack[index] : answerStream
                      }
                      variant="agent"
                    />
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
                  </>
                ) : (
                  <>
                    <SystemMessage
                      message={answerStack[index]}
                      variant="agent"
                    />
                  </>
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
          pb={2}
          gap={2}
        >
          <HStack gap={2}>
            {randomQuestions.slice(0, 2).map((question, index) => (
              <Tooltip label={question} placement="top" hasArrow key={index}>
                <Button
                  size="md"
                  width="30vw"
                  onClick={() => handleChatAction(false, undefined, question)}
                  bgColor={theme.colors[colorMode].secondaryContainer}
                  textColor={theme.colors[colorMode].onSecondaryContainer}
                >
                  {question}
                </Button>
              </Tooltip>
            ))}
          </HStack>
          <HStack gap={2}>
            {randomQuestions.slice(2, 4).map((question, index) => (
              <Tooltip label={question} placement="top" hasArrow key={index}>
                <Button
                  size="md"
                  width="30vw"
                  onClick={() => handleChatAction(false, undefined, question)}
                  bgColor={theme.colors[colorMode].secondaryContainer}
                  textColor={theme.colors[colorMode].onSecondaryContainer}
                >
                  {question}
                </Button>
              </Tooltip>
            ))}
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
