import { PlusSquareIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Text,
  HStack,
  useColorMode,
  Spacer,
} from "@chakra-ui/react";
import { useState } from "react";
import theme from "../../app/themes/theme";

interface SystemMessageProps {
  message: string;
  variant: "user" | "agent";
}

const SystemMessage = ({ message, variant }: SystemMessageProps) => {
  const [menuClicked, setMenuClicked] = useState(false); // Add state to track menu click
  const { colorMode } = useColorMode();

  return (
    <HStack>
      {variant === "user" && <Spacer />}
      <HStack
        bgColor={
          variant === "agent"
            ? theme.colors[colorMode].tertiary
            : theme.colors[colorMode].primary
        }
        pr={variant === "agent" ? 0 : 4}
        pl={4}
        py={0.5}
        rounded={8}
        gap={0}
        w="fit-content"
        minH={8}
      >
        <Text
          color={
            variant === "agent"
              ? theme.colors[colorMode].onTertiary
              : theme.colors[colorMode].onPrimary
          }
        >
          {message}
        </Text>
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
              <MenuItem
                onClick={() => {
                  setMenuClicked(true);
                }}
              >
                Copy to Working Document
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setMenuClicked(true);
                }}
              >
                Show in Source Document
              </MenuItem>
            </MenuList>
          </Menu>
        )}
      </HStack>
    </HStack>
  );
};

export default SystemMessage;
