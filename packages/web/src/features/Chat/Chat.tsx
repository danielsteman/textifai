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
import { AuthContext } from "../../app/providers/AuthProvider";
import { User } from "firebase/auth";
import { RootState } from "../../app/store";
import SystemMessage from "./SystemMessage";
import MessageLoadingIndicator from "./MessageLoadingIndicator";
import ExampleQuestions from "./ExampleQuestions";
import {
  getConversation,
  addMessageToCollection,
  updateConversationDate,
  fetchConversationId,
} from "./ChatFuncs";
import { useSelector, useDispatch } from "react-redux";
import { pushMessage } from "./messageStackSlice";
import { pushAnswer, replaceLastAnswer } from "./answerStackSlice";
import { setCurrentConversationId, setLoading } from "./chatSlice";
import { config } from "../../app/config/config";

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  const lastProcessedTextRef = useRef<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const currentUser: User | null | undefined = useContext(AuthContext);

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
  const extractedText = useSelector(
    (state: RootState) => state.chat.extractedText
  );

  const dispatch = useDispatch();

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

  const handleChatAction = async (regenerate = false, pdfText?: string) => {
    try {
      dispatch(setLoading(true));

      let requestPayload;
      if (pdfText) {
        console.log("Handling PdfQa Chain...");
        dispatch(pushMessage(pdfText));
        setMessage("");
        requestPayload = {
          prompt: pdfText,
          files: selectedDocuments,
          extractedText: extractedText,
          option: "pdfQa",
        };
      } else if (regenerate) {
        console.log("Handling Regenerate Chain...");
        const lastSystemMessage = answerStack[answerStack.length - 1];
        requestPayload = {
          prompt: lastSystemMessage,
          option: "regenerate",
        };
      } else {
        console.log("Handling Regular Chain...");
        dispatch(pushMessage(message));
        setMessage("");

        const updatedConversationHistory = await getConversation(
          currentConversationId!
        );

        requestPayload = {
          prompt: message,
          history: updatedConversationHistory,
          option: "GeneralQa",
          files: selectedDocuments,
          userId: currentUser!.uid,
          extractedText: extractedText,
        };
      }

      // DEBUG START

      // const documentsRes = await axios.post(
      //   `${config.chat.url}/api/chat/documents`,
      //   { currentUserId: currentUser!.uid }
      // );

      // console.log(documentsRes);

      // return;

      // DEBUG END

      const res = await axios.post(
        `${config.chat.url}/api/chat/ask`,
        requestPayload
      );

      if (pdfText) {
        dispatch(pushAnswer(res.data.answer));
        scrollToBottom();

        await addMessageToCollection(
          pdfText,
          "user",
          currentConversationId,
          null
        );
        await addMessageToCollection(
          res.data.answer,
          "agent",
          currentConversationId,
          null
        );
        await updateConversationDate(currentConversationId!);
      } else if (regenerate) {
        dispatch(replaceLastAnswer(res.data.answer));
      } else {
        dispatch(pushAnswer(res.data.answer));
        scrollToBottom();

        await addMessageToCollection(
          message,
          "user",
          currentConversationId,
          null
        );
        await addMessageToCollection(
          res.data.answer,
          "agent",
          currentConversationId,
          null
        );
        await updateConversationDate(currentConversationId!);
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
