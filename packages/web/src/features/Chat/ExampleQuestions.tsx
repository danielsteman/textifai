import { Flex, HStack, Button } from "@chakra-ui/react";

const ExampleQuestions = () => {
  return (
    <Flex
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      pb={2}
      gap={2}
    >
      <HStack gap={2}>
        <Button
          size="sm"
          onClick={() => {
            /* Your logic here */
          }}
        >
          Sample Question 1
        </Button>
        <Button
          size="sm"
          onClick={() => {
            /* Your logic here */
          }}
        >
          Sample Question 2
        </Button>
      </HStack>
      <HStack gap={2}>
        <Button
          size="sm"
          onClick={() => {
            /* Your logic here */
          }}
        >
          Sample Question 3
        </Button>
        <Button
          size="sm"
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
