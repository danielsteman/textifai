import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  HStack,
  VStack,
  Box,
  useColorMode,
  Spacer,
  Text,
  Heading,
  Tooltip,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import theme from "../../app/themes/theme";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../../app/providers/AuthProvider";
import { appendToDocument } from "./ChatFuncs";
import { User } from "firebase/auth";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { CopyIcon } from "@chakra-ui/icons";

interface SystemMessageProps {
  message: string;
  variant: "user" | "agent";
}

const SystemMessage = ({ message, variant }: SystemMessageProps) => {
  const [menuClicked, setMenuClicked] = useState(false);
  const { colorMode } = useColorMode();
  const { primary, tertiary, onPrimary, onTertiary } = theme.colors[colorMode];

  const bgColor = variant === "agent" ? tertiary : primary;
  const textColor = variant === "agent" ? onTertiary : onPrimary;

  const currentUser: User | null | undefined = useContext(AuthContext);

  const activeProjectId = useSelector(
    (state: RootState) => state.activeProject.projectId
  );

  const handleMenuClick = () => {
    appendToDocument(currentUser!.uid, activeProjectId!, message);
  };

  const markdownComponentMapping = {
    h1: ({ ...props }) => <Heading size="lg">{props.children}</Heading>,
    h2: ({ ...props }) => <Heading size="md">{props.children}</Heading>,
    h3: ({ ...props }) => <Heading size="sm">{props.children}</Heading>,
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
        mr={4}
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
