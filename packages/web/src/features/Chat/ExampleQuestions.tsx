import { Flex, HStack, Button, useColorMode, Box } from "@chakra-ui/react";
import { useSelector } from "react-redux"
import { RootState } from "../../app/store";
import theme from "../../app/themes/theme";


const ExampleQuestions = () => {

  const { colorMode } = useColorMode();

  const buttonSize = "100px"; // This can be adjusted as per your requirements.

  const pickRandomQuestions = (questions: string[], count: number | undefined) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const allSampleQuestions = useSelector((state: RootState) => state.sampleQuestions);
  const randomQuestions = pickRandomQuestions(allSampleQuestions, 4);

  return (
    <Flex flexDirection="column" alignItems="center" justifyContent="center" pb={2} gap={2}>
      <HStack gap={2}>
        {randomQuestions.slice(0, 2).map((question, index) => (
          <Button 
              size="sm" 
              width="30vw"
              height="2vw"
              onClick={() => {/* Your logic here */}} 
              key={index}
              bgColor={theme.colors[colorMode].secondaryContainer}
              textColor={theme.colors[colorMode].onSecondaryContainer}
          >
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
          </Button>
        ))}
      </HStack>
      <HStack gap={2}>
        {randomQuestions.slice(2, 4).map((question, index) => (
          <Button 
              size="sm" 
              width="30vw"
              height="2vw"
              onClick={() => {/* Your logic here */}} 
              key={index}
              bgColor={theme.colors[colorMode].secondaryContainer}
              textColor={theme.colors[colorMode].onSecondaryContainer}
          >
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
          </Button>
        ))}
      </HStack>
    </Flex>
  );
};

export default ExampleQuestions;
