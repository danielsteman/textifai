import {
  Box,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spacer,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { MdSend } from "react-icons/md";
import { v4 as uuidv4 } from "uuid";

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messageStack, setMessageStack] = useState<string[]>([]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessageStack([...messageStack, message]);
    try {
      const res = await axios.post("http://localhost:3001/api/chat/ask", {
        prompt: message,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Flex flexDir="column" flex={1} p={8}>
      <Box>
        {messageStack.map((msg) => (
          <Flex key={uuidv4()} mb={2}>
            <Spacer />
            <Text bgColor="teal" p={1} px={2} rounded={4}>
              {msg}
            </Text>
          </Flex>
        ))}
      </Box>
      <Spacer />
      <form onSubmit={handleSubmit}>
        <InputGroup>
          <Input
            placeholder="Ask a question about your documents"
            onChange={handleMessageChange}
          />
          <InputRightElement>
            <IconButton
              type="submit"
              aria-label="Ask question about your documents"
              icon={<MdSend />}
              variant="ghost"
              isDisabled={message === ""}
            />
          </InputRightElement>
        </InputGroup>
      </form>
    </Flex>
  );
};

export default Chat;
