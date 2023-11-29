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

  const dispatch = useDispatch();

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
    <Box as="ul" pl={4} ml={2} style={{ listStyleType: "disc" }}>
      {props.children}
    </Box>
  );

  const NestedUnorderedList = ({ ...props }) => (
    <Box as="ul" pl={4} style={{ listStyleType: "circle" }}>
      {props.children}
    </Box>
  );

  const OrderedList = ({ ...props }) => (
    <Box as="ol" pl={4} ml={2} style={{ listStyleType: "decimal" }}>
      {props.children}
    </Box>
  );

  const NestedOrderedList = ({ ...props }) => (
    <Box as="ol" pl={4} style={{ listStyleType: "lower-alpha" }}>
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
    nestedUl: NestedUnorderedList,
    ol: OrderedList,
    nestedOl: NestedOrderedList,
    li: ListItem,
    bpr: Paragraph,
  };

  return (
    <HStack m={2} px={10}>
      {variant === "user" && <Spacer />}
      <Box
        color={textColor}
        bgColor={bgColor}
        px={3}
        py={1}
        rounded={8}
        gap={0}
        maxW="80%"
        my={1}
        alignItems="start"
      >
        <HStack spacing={2}>
          <VStack spacing={0} flex="1" alignItems="start">
            <ReactMarkdown components={markdownComponentMapping}>
              {message}
            </ReactMarkdown>
          </VStack>
        </HStack>
      </Box>
      {variant === "agent" && (
        <Tooltip label="Copy to Working Document" placement="top">
          <IconButton
            top={0}
            aria-label="Options"
            icon={<CopyIcon />}
            variant="ghost"
            size="sm"
            color={theme.colors[colorMode].secondary}
            onClick={handleMenuClick}
          />
        </Tooltip>
      )}
    </HStack>
  );
};

export default SystemMessage;
