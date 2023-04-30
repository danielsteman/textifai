import {
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  Button,
  Heading,
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
    <>
      <Heading>Support</Heading>
      <Text>
        Do you experience any inconveniences with your product? Let us know!
      </Text>
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
        <Button type="submit" mt={2}>
          Send
        </Button>
      </form>
    </>
  );
};

export default Support;
