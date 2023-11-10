import React, { useContext, useRef, useState, useEffect } from "react";
import {
  Box,
  IconButton,
  useColorMode,
  Avatar,
  HStack,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Heading,
  Button,
  VStack,
  Text,
  Spacer,
} from "@chakra-ui/react";
import { SettingsIcon, UpDownIcon } from "@chakra-ui/icons";
import { MdLogout } from "react-icons/md";
import { auth } from "../../app/config/firebase";
import { AuthContext } from "../../app/providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import theme from "../../app/themes/theme";
import { shortenString } from "../utils/shortenString";
import ColorModeSwitcher from "./ColorModeSwitcher";

const UserCard = () => {
  const currentUser = useContext(AuthContext);
  const navigate = useNavigate();
  const { colorMode } = useColorMode();
  const triggerRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState(0);

  useEffect(() => {
    if (triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, []);

  return (
    <Box
      w="100%"
      p={2}
      mb={4}
      bgColor={theme.colors[colorMode].secondaryContainer}
      borderRadius="md"
    >
      <Popover placement="top-start">
        <PopoverTrigger>
        <HStack
            ref={triggerRef}
            display="flex"
            alignItems="center"
            gap="2"
            cursor="pointer"
            w="full"
          >
            <Avatar size="sm" />
            <Heading
              size="xs"
              color={theme.colors[colorMode].onSecondaryContainer}
              whiteSpace="nowrap"
            >
              {currentUser?.displayName &&
                shortenString(currentUser?.displayName, 14)}
            </Heading>
            <Spacer />
            <IconButton
              icon={<UpDownIcon />}
              size="sm"
              variant="ghost"
              aria-label="User options"
            />
          </HStack>
        </PopoverTrigger>
        <PopoverContent
          width={popoverWidth}
          maxW="none"
          bgColor={theme.colors[colorMode].secondaryContainer}
          borderColor={theme.colors[colorMode].border}
          borderRadius="md"
          boxShadow="sm"
        >
          {/* <PopoverArrow bgColor={theme.colors[colorMode].secondaryContainer} /> */}
          <PopoverBody>
            <VStack align="start">
              <Button w="full" justifyContent="start" onClick={() => navigate("/settings")}>
                <SettingsIcon mr={2} />
                <Text ml={0}>Settings</Text>
              </Button>
              <Button w="full" justifyContent="start" onClick={() => {
                auth.signOut();
                navigate("/");
              }}>
                <MdLogout/>
                <Text ml={2}>Sign out</Text>
              </Button>
              <ColorModeSwitcher />
            </VStack>
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default UserCard;
