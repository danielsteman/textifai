import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Heading,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";

const Support = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubjectChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubject(event.target.value);
  };

  const handleMessageChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: any) => {
    console.log(subject);
    console.log(message);
    event.preventDefault();
  };

  return (
    <VStack alignItems="center" py={20} gap={4}>
      <Heading size="md">Let's get in touch!</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Subject</FormLabel>
          <Input
            type="email"
            onChange={handleSubjectChange}
            value={subject}
            isRequired
          />
          <Textarea
            placeholder="Message"
            mt={6}
            onChange={handleMessageChange}
            value={message}
            isRequired
          />
        </FormControl>
        <Button type="submit" mt={4}>
          Send
        </Button>
      </form>
    </VStack>
  );
};

export default Support;
