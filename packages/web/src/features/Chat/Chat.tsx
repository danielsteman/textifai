import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SkeletonCircle,
  Spacer,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from 'react-markdown';

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messageStack, setMessageStack] = useState<string[]>([]);
  const [answerStack, setAnswerStack] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getConversation = () => {
    const lastThreeConversations: string[] = [];

    // Loop from the end of the stacks to get the last 3 conversations
    for (let i = 1; i <= 3 && i <= messageStack.length; i++) {
      // Get the user message and AI answer
      const userMessage = messageStack[messageStack.length - i];
      const aiAnswer = answerStack[answerStack.length - i];

      // Format and add them to the result array
      lastThreeConversations.unshift(`USER: ${userMessage}`);
      lastThreeConversations.unshift(`AI: ${aiAnswer}`);
    }

    return lastThreeConversations;
  };

  const history = getConversation();
  useEffect(() => {
    scrollToBottom();
  }, [messageStack, answerStack]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessageStack([...messageStack, message]);
    setMessage("");
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3001/api/chat/ask", {
        prompt: message,
        history: history,
      });
      setAnswerStack([...answerStack, res.data.answer]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
    console.log(messageStack);
  };

  return (
    <Flex flexDir="column" flex={1} p={8} overflow="hidden">
      <Box mb={4} flex={1} overflowY="scroll">
        {messageStack.map((msg, index) => (
          <Box key={uuidv4()} py={2}>
            <Flex mb={2}>
              <Spacer />
              <Text bgColor="teal" p={1} px={2} rounded={4}>
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
              <Flex>
                <Box bgColor="pink" p={1} px={2} rounded={4}>
                  <ReactMarkdown>
                    {answerStack[index]}
                  </ReactMarkdown>
                </Box>
              </Flex>
            )}
          </Box>
        ))}
        <Box ref={messagesEndRef} />
      </Box>
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
