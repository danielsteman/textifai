import {
    Box,
    Flex,
    Text,
    Divider,
    Input,
    Button,
    Avatar,
    Icon,
    IconButton,
    VStack,
    HStack
  } from "@chakra-ui/react";
  import { AiOutlineArrowUp, AiFillExclamationCircle } from "react-icons/ai";
  import React, { useRef } from 'react';

  const AccountSettings = () => {
    const user = {
      avatarUrl: "URL_OF_USER_AVATAR",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      emailVerified: false
    };

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        if (file) {
            console.log(file);
        }
    };
  
    return (
      <Box p={6} boxShadow="base" borderRadius="md" bg="white" w="50%" m="auto">
        <Text fontSize="2xl" mb={4}>Account settings</Text>
  
        {/* Profile Section */}
        <Text fontSize="xl" mb={4}>Profile</Text>
        
        <VStack spacing={4} alignItems="start" mb={4}>
          <Box position="relative">
            <Avatar size="2xl" name={`${user.firstName} ${user.lastName}`} src={user.avatarUrl} />
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }} // hide the input field
            />
            <IconButton 
                icon={<Icon as={AiOutlineArrowUp}/>} 
                position="absolute" 
                bottom={1} 
                right={1} 
                backgroundColor="white" 
                borderColor="black"
                borderWidth="1px"
                isRound 
                aria-label="Upload Image" 
                onClick={() => fileInputRef.current?.click()}
            />
          </Box>
          
          <Flex direction="column">
            <Text mb={2}>First name</Text>
            <Input variant="flushed" borderRadius="sm" placeholder={user.firstName} w="60%" />
          </Flex>
          
          <Flex direction="column">
            <Text mb={2}>Last name</Text>
            <Input variant="flushed" borderRadius="sm" placeholder={user.lastName} w="60%" />
          </Flex>
        </VStack>
  
        <Divider mb={4} />
  
        {/* Email Section */}
        <Text fontSize="xl" mb={4}>Email and Phone</Text>
        <VStack spacing={4} mb={4} align="start">
        <Text mb={2}>Email</Text>
        <Input variant="flushed" borderRadius="sm" placeholder={user.email} w="60%" />
        {
          user.emailVerified ? (
            <Button colorScheme="blue" mt={2}>Update email</Button>
          ) : (
            <Button colorScheme="orange" mt={2} leftIcon={<Icon as={AiFillExclamationCircle} />}>Send verification mail</Button>
          )
        }

        <Text mb={2}>Phone Number</Text>
        <Input variant="flushed" borderRadius="sm" placeholder="Enter phone number" w="60%" />
        <Button colorScheme="blue" mt={2}>Update phone number</Button>
      </VStack>
  
        <Divider mb={4} />
  
        <Text fontSize="xl" mb={4}>Password</Text>
        {/* Password Section */}
        <Flex direction="column" mb={4}>
          <Text mb={2}>Current password</Text>
          <Input variant="flushed" type="password" borderRadius="sm" placeholder="******" w="60%" />
        </Flex>
  
        {/* New Password Section */}
        <Flex direction="column" mb={4}>
          <Text mb={2}>New password</Text>
          <Input variant="flushed" type="password" borderRadius="sm" placeholder="******" w="60%" />
        </Flex>
  
        {/* Password Confirmation Section */}
        <Flex direction="column" mb={4}>
          <Text mb={2}>Confirm new password</Text>
          <Input variant="flushed" type="password" borderRadius="sm" placeholder="******" w="60%" />
        </Flex>
  
        <Button colorScheme="blue" mb={4}>Change password</Button>

        <Divider mb={4} />

        {/* Delete Account Section */}
        <Text fontSize="xl" mb={4}>Delete Account</Text>
        <Text fontSize="sm" mb={4}>If you no longer want to use Textifai, you can permenantly delete your account. You can't undo this action.</Text>
        {/* Delete Account Section */}
        <Button colorScheme="red" variant="outline" leftIcon={<Icon as={AiFillExclamationCircle} />}>
            Delete Account
        </Button>
        </Box>
        );
    };
  
  export default AccountSettings;
  