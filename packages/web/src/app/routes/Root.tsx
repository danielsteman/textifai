import { Box, Button, Center, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Root = () => {
  const navigate = useNavigate();
  return (
    <Center
      bgGradient="linear(to-l, #7928CA, #FF0080)"
      textAlign="center"
      flex="1"
    >
      <Box maxW={500}>
        <Heading color="lightgrey" fontWeight={900} size="2xl">
          Interact with your documents through chat ⚡
        </Heading>
        <Button
          mt={8}
          variant="solid"
          size="lg"
          onClick={() => navigate("/features/create-project")}
        >
          Get started
        </Button>
      </Box>
    </Center>
  );
};

export default Root;
