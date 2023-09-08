import {
  Box,
  Button,
  Grid,
  GridItem,
  HStack,
  Spacer,
  Text,
} from "@chakra-ui/react";
import TextEditor from "../TextEditor/TextEditor";

export interface CustomTabPanelProps {
  openChatSupport: boolean;
  openMiniLibrary: boolean;
}

const EditorPanel = () => {
  return (
    <Box h="100%">
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
