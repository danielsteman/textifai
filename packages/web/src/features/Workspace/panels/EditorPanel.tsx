import { Button, HStack, Spacer, Text, useColorMode } from "@chakra-ui/react";
import TextEditor from "../../TextEditor/TextEditor";
import theme from "../../../app/themes/theme";

export interface CustomTabPanelProps {
  openChatSupport: boolean;
  openMiniLibrary: boolean;
}

const EditorPanel = () => {
  const { colorMode } = useColorMode();
  return (
    <>
      <HStack
        mb={2}
        p={2}
        bgColor={theme.colors[colorMode].surfaceContainerLow}
        rounded={8}
      >
        <Text ml={4}>Project title</Text>
        <Spacer />
        <Button size="sm">Templates</Button>
        <Button size="sm">Refine</Button>
        <Button size="sm">Settings</Button>
      </HStack>
      <TextEditor />
    </>
  );
};

export default EditorPanel;
