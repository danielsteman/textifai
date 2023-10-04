import { PlusSquareIcon } from "@chakra-ui/icons";
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
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import theme from "../../app/themes/theme";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../../app/providers/AuthProvider";
import { appendToDocument } from "./ChatFuncs";
import { User } from "firebase/auth";
import { fetchProjectId } from "../../common/utils/getCurrentProjectId";

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

  const [activeProject, setActiveProject] = useState<string | null>(null);

  useEffect(() => {
    const fetchActiveProject = async () => {
      const projectId = await fetchProjectId(currentUser!.uid);
      setActiveProject(projectId);
    };

    fetchActiveProject();
  }, [currentUser]);

  const handleMenuClick = () => {
    appendToDocument(currentUser!.uid, activeProject!, message);
    setMenuClicked(true);
  };

  return (
    <HStack mb={2}>
      {variant === "user" && <Spacer />}
      <Box
        textColor={textColor}
        bgColor={bgColor}
        pr={variant === "agent" ? 0 : 6}
        pl={variant === "agent" ? 6 : 4}
        py={0.5}
        rounded={8}
        gap={0}
        w="fit-content"
        minH={8}
      >
        <HStack spacing={2} align="start">
          <VStack align="start" spacing={0} flex="1">
            <ReactMarkdown>{message}</ReactMarkdown>
          </VStack>
          {!menuClicked && variant === "agent" && (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<PlusSquareIcon />}
                variant="ghost"
                size="sm"
              />
              <MenuList>
                <MenuItem onClick={handleMenuClick}>
                  Copy to Working Document
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
