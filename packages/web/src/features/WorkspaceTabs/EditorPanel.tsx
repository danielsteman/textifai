import { Box, Button, HStack, Spacer, Text } from "@chakra-ui/react";
import TextEditor from "../TextEditor/TextEditor";

const EditorPanel = () => {
  return (
    <Box h="100%" position="relative" overflow="hidden">
      <HStack mb={2}>
        <Text ml={4}>Project title</Text>
        <Spacer />
        <Button size="sm">Templates</Button>
        <Button size="sm">Refine</Button>
        <Button size="sm">Settings</Button>
      </HStack>
      <TextEditor />
    </Box>
  );
};

export default EditorPanel;
