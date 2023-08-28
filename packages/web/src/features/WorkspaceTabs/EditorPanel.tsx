import { Box, Button, HStack, Text } from "@chakra-ui/react";
import TextEditor from "../TextEditor/TextEditor";

const EditorPanel = () => {
  return (
    <Box p={2}>
      <HStack bgColor={"black"} borderTopRadius={16} p={2}>
        <Text>Project title</Text>
        <Button>Templates</Button>
      </HStack>
      <TextEditor />
    </Box>
  );
};

export default EditorPanel;
