import { Box, Button, Center, Heading, useColorMode } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import theme from "../themes/theme";

const Root = () => {
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  return (
    <Center
      bgGradient={`linear(to-l, ${theme.colors[colorMode].primary}, ${theme.colors[colorMode].tertiary})`}
      textAlign="center"
      flex="1"
    >
      <Box maxW={500}>
        <Heading
          color="lightgrey"
          fontWeight={900}
          size="2xl"
          textColor={theme.colors[colorMode].surface}
        >
          Interact with your documents through chat ⚡
        </Heading>
        <Button
          mt={8}
          variant="solid"
          size="lg"
          onClick={() => navigate("/features/onboarding")}
        >
          Get started
        </Button>
      </Box>
    </Center>
  );
};

export default Root;
