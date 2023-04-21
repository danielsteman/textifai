import { Box, Button, Center, Heading } from "@chakra-ui/react";

export default function Root() {
  return (
    <Center
      bgGradient="linear(to-l, #7928CA, #FF0080)"
      w={"100%"}
      textAlign="center"
      h="85vw"
    >
      <Box maxW={500}>
        <Heading color="lightgrey" fontWeight={900} size="2xl">
          From ideation to deployment with speed 🚀
        </Heading>
        <Button mt={8} variant="solid" size="lg">
          Get started
        </Button>
      </Box>
    </Center>
  );
}
