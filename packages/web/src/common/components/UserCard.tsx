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
} from "@chakra-ui/react";
import { UpDownIcon } from "@chakra-ui/icons";
import { auth } from "../../app/config/firebase";
import ColorModeSwitcher from "./ColorModeSwitcher";
import { AuthContext } from "../../app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import theme from "../../app/themes/theme";

interface UserCardProps {
  onLogout?: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ onLogout }) => {
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
        <HStack gap={2}>
          <Avatar size="sm" />
          <Heading
            size="xs"
            color={theme.colors[colorMode].onSecondaryContainer}
            whiteSpace="nowrap"
          >
            {currentUser?.displayName}
          </Heading>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<UpDownIcon />}
              size="sm"
              variant="ghost"
            />
            <MenuList>
              <MenuItem
                onClick={() => {
                  navigate("/settings");
                }}
              >
                Settings
              </MenuItem>
              <MenuItem
                onClick={() => {
                  auth.signOut();
                  navigate("/");
                }}
              >
                Sign out
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
