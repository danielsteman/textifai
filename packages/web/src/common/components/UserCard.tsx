import { useContext } from "react";
import {
  Box,
  IconButton,
  useColorMode,
  Avatar,
  HStack,
  VStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Heading,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { SettingsIcon, UpDownIcon } from "@chakra-ui/icons";
import { auth } from "../../app/config/firebase";
import ColorModeSwitcher from "./ColorModeSwitcher";
import { AuthContext } from "../../app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import theme from "../../app/themes/theme";
import { shortenString } from "../utils/shortenString";
import { MdLogout } from "react-icons/md";

const UserCard = () => {
  const currentUser = useContext(AuthContext);
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  return (
    <Box
      w="100%"
      p={2}
      mb={4}
      bgColor={theme.colors[colorMode].secondaryContainer}
      borderRadius="md"
    >
      <VStack align="start" spacing={2}>
        <HStack gap={2} w="100%">
          <Menu>
            <MenuButton>
              <Avatar size="sm" />
            </MenuButton>
            <Heading
              size="xs"
              color={theme.colors[colorMode].onSecondaryContainer}
              whiteSpace="nowrap"
            >
              {currentUser?.displayName &&
                shortenString(currentUser?.displayName, 14)}
            </Heading>
            <Spacer />

            <MenuButton
              as={IconButton}
              icon={<UpDownIcon />}
              size="sm"
              variant="ghost"
            />
            <MenuList minW="0" w="fit-content">
              <MenuItem
                w="fit-content"
                pr={6}
                rounded={8}
                onClick={() => {
                  navigate("/settings");
                }}
              >
                <HStack gap={4}>
                  <SettingsIcon />
                  <Text>Settings</Text>
                </HStack>
              </MenuItem>
              <MenuItem
                w="fit-content"
                pr={6}
                rounded={8}
                onClick={() => {
                  auth.signOut();
                  navigate("/");
                }}
              >
                <HStack gap={4}>
                  <MdLogout />
                  <Text>Sign out</Text>
                </HStack>
              </MenuItem>
              <ColorModeSwitcher />
            </MenuList>
          </Menu>
        </HStack>
      </VStack>
    </Box>
  );
};

export default UserCard;
