import {
  CloseButton,
  HStack,
  Input,
  Spacer,
  Text,
  Tooltip,
  useColorMode,
} from "@chakra-ui/react";
import TextEditor from "../../TextEditor/TextEditor";
import theme from "../../../app/themes/theme";
import { useContext, useState } from "react";
import { ProjectContext } from "../../../app/providers/ProjectProvider";
import { getCurrentProjectTitle } from "../../../common/utils/getCurrentProjectTitle";

import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";

export interface CustomTabPanelProps {
  openChatSupport: boolean;
  openMiniLibrary: boolean;
}

const EditorPanel = () => {
  const { colorMode } = useColorMode();
  const userProjects = useContext(ProjectContext);
  const [inputMode, setInputMode] = useState<boolean>(false);

  const currentProjectTitle = useSelector(
    (state: RootState) => state.activeProject.projectName);

  return (
    <>
      <HStack
        mb={2}
        p={2}
        bgColor={theme.colors[colorMode].surfaceContainerLow}
        rounded={8}
      >
        <Tooltip label={"Change title"}>
          {inputMode ? (
            <HStack w="100%">
              <Input placeholder={currentProjectTitle!} />
              <Spacer />
              <CloseButton size="sm" onClick={() => setInputMode(!inputMode)} />
            </HStack>
          ) : (
            <Text
              ml={4}
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
    </>
  );
};

export default EditorPanel;
