import {
  Center,
  CloseButton,
  HStack,
  Input,
  Spacer,
  Text,
  Tooltip,
  VStack,
  useColorMode,
} from "@chakra-ui/react";
import TextEditor from "../../TextEditor/TextEditor";
import theme from "../../../app/themes/theme";
import { useState } from "react";

import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

export interface CustomTabPanelProps {
  openChatSupport: boolean;
  openMiniLibrary: boolean;
}

const EditorPanel = () => {
  const { colorMode } = useColorMode();
  const [inputMode, setInputMode] = useState<boolean>(false);

  const currentProjectTitle = useSelector(
    (state: RootState) => state.activeProject.projectName
  );

  return (
    <Center h="100%">
      <VStack h="100%" align="center" justify="center" maxW={1020} minW={816}>
        <HStack
          w="100%"
          p={2}
          bgColor={theme.colors[colorMode].surfaceContainerLow}
          rounded={8}
        >
          <Tooltip label={"Change title"}>
            {inputMode ? (
              <HStack w="100%">
                <Input placeholder={currentProjectTitle!} />
                <Spacer />
                <CloseButton
                  size="sm"
                  onClick={() => setInputMode(!inputMode)}
                />
              </HStack>
            ) : (
              <Text
                mx={4}
                cursor="pointer"
                onClick={() => setInputMode(!inputMode)}
              >
                {currentProjectTitle}
              </Text>
            )}
          </Tooltip>
          <Spacer />
        </HStack>
        <TextEditor />
      </VStack>
    </Center>
  );
};

export default EditorPanel;
