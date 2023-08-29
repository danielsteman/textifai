import { Box, Button, Flex, HStack, Spacer, Text } from "@chakra-ui/react";
import TextEditor from "../TextEditor/TextEditor";

const EditorPanel = () => {
  return (
    <Box h="100%" position="relative" overflow="hidden">
      <HStack>
        <Text>Project title</Text>
        <Spacer />
        <Button>Templates</Button>
        <Button>Refine</Button>
        <Button>Settings</Button>
      </HStack>
      <TextEditor />
    </Box>
  );
};

export default EditorPanel;
