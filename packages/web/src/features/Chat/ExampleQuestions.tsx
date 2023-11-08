import { Flex, HStack, Button, useColorMode, Box, Tooltip } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import theme from "../../app/themes/theme";
import { pushMessage } from "./messageStackSlice";
import { pushAnswer } from "./answerStackSlice";
import { AuthContext } from "../../app/providers/AuthProvider";
import { User } from "firebase/auth";
import { useContext } from "react";
import axios from "axios";
import { addMessageToCollection, updateConversationDate } from "./ChatFuncs";
import { config } from "../../app/config/config";
import { setLoading } from "./chatSlice";

const ExampleQuestions = () => {
  const currentUser: User | null | undefined = useContext(AuthContext);
  const { colorMode } = useColorMode();

  const dispatch = useDispatch();
  const selectedDocuments = useSelector(
    (state: RootState) => state.library.selectedDocuments
  );
  const currentConversationId = useSelector(
    (state: RootState) => state.chat.currentConversationId
  );

  const handleSubmit = async (question: string) => {
    try {
      dispatch(setLoading(true));

      dispatch(pushMessage(question));
      const requestPayload = {
        prompt: question,
        option: "GeneralQa",
        files: selectedDocuments,
        userId: currentUser!.uid,
      };

      const res = await axios.post(
        `${config.chat.url}/api/chat/ask`,
        requestPayload
      );

      dispatch(pushAnswer(res.data.answer));
      await addMessageToCollection(
        question,
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

      dispatch(setLoading(false));
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    }
  };

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
  const randomQuestions = pickRandomQuestions(allSampleQuestions, 4);

  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      pb={2}
      gap={2}
    >
      <HStack gap={2}>
        {randomQuestions.slice(0, 2).map((question, index) => (
          <Button
            size="sm"
            width="30vw"
            height="2vw"
            onClick={() => handleSubmit(question)}
            key={index}
            bgColor={theme.colors[colorMode].secondaryContainer}
            textColor={theme.colors[colorMode].onSecondaryContainer}
          >
            <Tooltip label={question} placement="top" hasArrow>
            <Box
              as="span"
              display="block"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              w="100%"
            >
              {question}
            </Box>
            </Tooltip>
          </Button>
        ))}
      </HStack>
      <HStack gap={2}>
        {randomQuestions.slice(2, 4).map((question, index) => (
          <Button
            size="sm"
            width="30vw"
            height="2vw"
            onClick={() => handleSubmit(question)}
            key={index}
            bgColor={theme.colors[colorMode].secondaryContainer}
            textColor={theme.colors[colorMode].onSecondaryContainer}
          >
            <Tooltip label={question} placement="top" hasArrow>
            <Box
              as="span"
              display="block"
              overflow="hidden"
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              w="100%"
            >
              {question}
            </Box>
            </Tooltip>
          </Button>
        ))}
      </HStack>
    </Flex>
  );
};

export default ExampleQuestions;
