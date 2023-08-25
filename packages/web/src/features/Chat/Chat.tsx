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
  useDisclosure,
} from "@chakra-ui/react";
import { ArrowRightIcon } from '@chakra-ui/icons';
import React, { useEffect, useRef, useState } from "react";
import { MdSend } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from 'react-markdown';
import axios from "axios";

type SystemMessageProps = {
  message: string;
};

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messageStack, setMessageStack] = useState<string[]>([]);
  const [answerStack, setAnswerStack] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

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
      });
      setAnswerStack([...answerStack, res.data.answer]);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const SystemMessage = ({ message }: { message: string }) => {
    return (
      <Flex align="center" justifyContent="flex-start">
        <Box 
          display="flex" 
          alignItems="center" 
          bgColor="pink" 
          p={1} 
          px={2} 
          rounded={4} 
          position="relative"
        >
          <Text whiteSpace="pre-line">
            {message}
          </Text>
          
          <Box position="absolute" right={2} top={1}>
            <Menu>
              <MenuButton aria-label="Options" p={0} color="grey">
                <ArrowRightIcon />
              </MenuButton>
              <MenuList>
                <MenuItem>Elaborate</MenuItem>
                <MenuItem>Shorten</MenuItem>
                <MenuItem>Paraphrase</MenuItem>
                <MenuItem>Show in Document</MenuItem>
              </MenuList>
            </Menu>
          </Box>
        </Box>
      </Flex>
    );
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
              <SystemMessage message={answerStack[index]} />
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
