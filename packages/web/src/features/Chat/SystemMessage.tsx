import {
  IconButton,
  HStack,
  VStack,
  Box,
  useColorMode,
  Spacer,
  Heading,
  Tooltip,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import theme from "../../app/themes/theme";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../../app/providers/AuthProvider";
import { appendToDocument } from "./ChatFuncs";
import { User } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { CopyIcon } from "@chakra-ui/icons";
import EditorPanel from "../Workspace/panels/EditorPanel";
import { addTab } from "../Workspace/tabsSlice";

interface SystemMessageProps {
  message: string;
  variant: "user" | "agent";
}

const SystemMessage = ({ message, variant }: SystemMessageProps) => {
  const { colorMode } = useColorMode();
  const { primary, tertiary, onPrimary, onTertiary } = theme.colors[colorMode];

  const dispatch = useDispatch()

  const bgColor = variant === "agent" ? tertiary : primary;
  const textColor = variant === "agent" ? onTertiary : onPrimary;

  const currentUser: User | null | undefined = useContext(AuthContext);

  const activeProjectId = useSelector(
    (state: RootState) => state.activeProject.projectId
  );

  const handleMenuClick = () => {
    appendToDocument(currentUser!.uid, activeProjectId!, message);
    const tab = {
      name: "Editor",
      panel: <EditorPanel />,
      openChatSupport: false,
      openMiniLibrary: false,
      openPdfViewer: false,
    };
    dispatch(addTab(tab));
  };

  const UnorderedList = ({ ...props }) => (
    <Box as="ul" pl={4} ml={2} style={{ listStyleType: 'disc' }}>
      {props.children}
    </Box>
  );

  const ListItem = ({ ...props }) => (
    <Box as="li" pl={2}>
      {props.children}
    </Box>
  );

  const Paragraph = ({ ...props }) => (
    <Box as="p" my={2}>
      {props.children}
    </Box>
  );
  
  const markdownComponentMapping = {
    h1: ({ ...props }) => <Heading size="lg">{props.children}</Heading>,
    h2: ({ ...props }) => <Heading size="md">{props.children}</Heading>,
    h3: ({ ...props }) => <Heading size="sm">{props.children}</Heading>,
    ul: UnorderedList,
    li: ListItem,
    bpr: Paragraph,
  };

  return (
    <HStack m={2}>
      {variant === "user" && <Spacer />}
      <Box
        color={textColor}
        bgColor={bgColor}
        pr={variant === "agent" ? 0 : 6}
        pl={variant === "agent" ? 6 : 4}
        py={1}
        rounded={8}
        gap={0}
        w="fit-content"
        maxW="80%"
        minH={8}
        mx={10}
        my={1}
        alignItems="start"
      >
        <HStack spacing={2}>
          <VStack spacing={0} flex="1" alignItems="start">
            <ReactMarkdown components={markdownComponentMapping}>
              {message}
            </ReactMarkdown>
          </VStack>
          {variant === "agent" && (
            <Box position="relative" alignSelf="flex-start">
              <Tooltip label="Copy to Working Document" placement="top">
                <IconButton
                  aria-label="Options"
                  icon={<CopyIcon />}
                  variant="ghost"
                  size="md"
                  color={theme.colors[colorMode].onSecondary}
                  onClick={handleMenuClick}
                />
              </Tooltip>
            </Box>
          )}
        </HStack>
      </Box>
    </HStack>
  );
};

export default SystemMessage;
