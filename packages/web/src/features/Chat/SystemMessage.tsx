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
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import theme from "../../app/themes/theme";
import ReactMarkdown from "react-markdown";
import { AuthContext } from "../../app/providers/AuthProvider";
import { appendToDocument } from "./ChatFuncs";
import { User } from "firebase/auth";
// import { fetchProjectId } from "../../common/utils/getCurrentProjectId";
import { FaPlus } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";

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

  return (
    <HStack mb={2}>
      {variant === "user" && <Spacer />}
      <Box
        textColor={textColor}
        bgColor={bgColor}
        pr={variant === "agent" ? 0 : 4}
        pl={4}
        py={0.5}
        rounded={8}
        gap={0}
        w="fit-content"
        minH={8}
        alignItems="center"
      >
        <HStack spacing={2}>
          <VStack spacing={0} flex="1">
            <ReactMarkdown>{message}</ReactMarkdown>
          </VStack>
          {!menuClicked && variant === "agent" && (
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<FaPlus />}
                variant="ghost"
                size="sm"
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