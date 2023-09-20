import { Flex, HStack, Button } from "@chakra-ui/react";

const ExampleQuestions = () => {
  return (
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
  );
};

export default ExampleQuestions;
