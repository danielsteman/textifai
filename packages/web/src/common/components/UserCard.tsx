import React from 'react';
import { Box, Text, useTheme, useColorMode, Avatar, HStack, Button, VStack } from "@chakra-ui/react";
import { FaCog, FaSignOutAlt } from "react-icons/fa"; 
import { useNavigate } from 'react-router-dom';

interface UserCardProps {
  onLogout: () => void;  
}

const UserCard: React.FC<UserCardProps> = ({ onLogout }) => {
    const theme = useTheme();
    const { colorMode } = useColorMode(); // Get the current color mode

    const navigate = useNavigate(); // Initialize the useHistory hook

    return (
        <Box
          w="100%"
          p={5}
          mb={4}
          bgColor={colorMode === "light" ? "gray.200" : "gray.700"}
          borderRadius="md"
        >
          <VStack align="start" spacing={2}>
            <HStack spacing={4}>
              <Avatar size="sm" />
              <VStack align="start">
                <Text fontSize="sm">Henk de Tank</Text>
                {/* <Text fontSize="xs" color={colorMode === "light" ? "gray.700" : "gray.300"}>
                  {currentUser?.email}
                </Text> */}
              </VStack>
            </HStack>
    
            <HStack spacing={3} mt={2}>
            <Button leftIcon={<FaCog />} size="xs" variant="ghost" onClick={() => navigate('/account-settings')}>
                Account settings
            </Button>
            <Button leftIcon={<FaSignOutAlt />} size="xs" variant="ghost" onClick={onLogout}>
                Logout
            </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default UserCard;
