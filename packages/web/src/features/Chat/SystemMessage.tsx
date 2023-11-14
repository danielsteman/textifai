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
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import theme from "../../app/themes/theme";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../../app/providers/AuthProvider";
import { appendToDocument } from "./ChatFuncs";
import { User } from "firebase/auth";
import {
  FaArrowRight,
  FaCircle,
  FaCommentDots,
  FaOptinMonster,
  FaPen,
  FaPlus,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ArrowRightIcon, ArrowUpDownIcon, CopyIcon } from "@chakra-ui/icons";
import { MdCallToAction, MdSettings } from "react-icons/md";

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
    setMenuClicked(true);
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
        pr={variant === "agent" ? 0 : 3}
        pl={3}
        py={1}
        rounded={8}
        gap={0}
        w="fit-content"
        maxW="80%"
        minH={8}
        alignItems="start"
      >
        <HStack spacing={2}>
          <VStack spacing={0} flex="1" alignItems="start">
            <ReactMarkdown components={markdownComponentMapping}>
              {message}
            </ReactMarkdown>
          </VStack>
          {!menuClicked && variant === "agent" && (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<CopyIcon />}
                variant="ghost"
                size="xs"
                color={theme.colors[colorMode].onSecondary}
              />
              <MenuList>
                <MenuItem onClick={handleMenuClick}>
                  <Text color={theme.colors[colorMode].secondary}>
                    Copy to Working Document
                  </Text>
                </MenuItem>
              </MenuList>
            </Menu>
          )}
        </HStack>
      </Box>
    </HStack>
  );
};

export default SystemMessage;
