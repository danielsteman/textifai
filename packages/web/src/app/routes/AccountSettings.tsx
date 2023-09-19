import {
    Box,
    Flex,
    Heading,
    Divider,
    Input,
    Button,
    Avatar,
    Icon,
    IconButton,
    VStack,
    useColorMode,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    HStack,
  } from "@chakra-ui/react";
  import { AiOutlineArrowUp, AiFillExclamationCircle, AiOutlineWarning } from "react-icons/ai";
  import { getAuth, sendEmailVerification, deleteUser } from "firebase/auth";
  import React, { useRef, useState } from 'react';
  import { useNavigate } from "react-router-dom";
  import theme from "../../app/themes/theme";

  interface ModalTemplateProps {
    title: string;
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
  }

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

    const [message, setMessage] = useState(''); 
    const { colorMode } = useColorMode();
    const { isOpen: isNameModalOpen, onOpen: onNameModalOpen, onClose: onNameModalClose } = useDisclosure();
    const { isOpen: isEmailModalOpen, onOpen: onEmailModalOpen, onClose: onEmailModalClose } = useDisclosure();
    const { isOpen: isPasswordModalOpen, onOpen: onPasswordModalOpen, onClose: onPasswordModalClose } = useDisclosure();

    const ModalTemplate: React.FC<ModalTemplateProps> = ({ title, isOpen, onClose, children }) => (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{children}</ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );

    const sendVerificationEmail = () => {
        const auth = getAuth();
    
        if (auth.currentUser) {
            sendEmailVerification(auth.currentUser)
                .then(() => {
                    setMessage('Verification email sent successfully!');
                })
                .catch(error => {
                    setMessage(`Error sending verification email: ${error.message}`);
                });
        } else {
            setMessage('Current user not found.');
        }
    }

    const navigate = useNavigate();
    const handleDeleteAccount = () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            deleteUser(user).then(() => {
                navigate('/');
            }).catch((error) => {
                // Handle error during user deletion
            });
        } else {
            // Handle scenario where current user is not found
        }
    }
  
    return (
      <Box p={6} boxShadow="base" borderRadius="md" bgColor={theme.colors[colorMode].container} w="50%" m="auto" >
        <Heading fontSize="2xl" mb={4}>Account settings</Heading>
  
        {/* Profile Section */}
        <Heading fontSize="xl" mb={4}>Profile</Heading>
        
        <VStack spacing={4} alignItems="start" mb={4}>
          <Box position="relative">
            <Avatar size="2xl" name={`${user.firstName} ${user.lastName}`} src={user.avatarUrl} />
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }} 
            />
            <IconButton 
                icon={<Icon as={AiOutlineArrowUp}/>} 
                position="absolute" 
                bottom={1} 
                right={1} 
                bgColor={theme.colors[colorMode].IconButton} 
                borderColor="black"
                borderWidth="1px"
                isRound 
                aria-label="Upload Image" 
                onClick={() => fileInputRef.current?.click()}
            />
          </Box>
        </VStack>

        <HStack spacing={6} mb={6}>  
        {/* Name Modal */}
          <Button onClick={onNameModalOpen}>Edit Name</Button>
            <ModalTemplate title="Edit Name" isOpen={isNameModalOpen} onClose={onNameModalClose}>
              <Flex direction="column">
                <Heading mb={2} fontSize="l">First name</Heading>
                <Input variant="flushed" borderRadius="sm" placeholder={user.firstName} w="60%" />
              </Flex>
              <Flex direction="column">
                <Heading mb={2} fontSize="l">Last name</Heading>
                <Input variant="flushed" borderRadius="sm" placeholder={user.lastName} w="60%" />
              </Flex>
            </ModalTemplate>

          {/* Email and Phone Modal */}
          <Button onClick={onEmailModalOpen}>Edit Email and Phone</Button>
          <ModalTemplate title="Email and Phone" isOpen={isEmailModalOpen} onClose={onEmailModalClose}>
            <VStack spacing={4} mb={4} align="start">
              <Heading mb={2} fontSize="l">Email</Heading>
              <Input variant="flushed" borderRadius="sm" placeholder={user.email} w="60%" />
              {!user.emailVerified ? 
                <Button 
                  leftIcon={<Icon as={AiOutlineWarning} />} 
                  colorScheme="orange" 
                  variant="outline" 
                  mt={2}
                  onClick={sendVerificationEmail}
                >
                  Send verification mail
                </Button> 
                : 
                <Button colorScheme="blue" variant="outline" mt={2}>
                  Update Email
                </Button>
              }
              <Heading mb={2} fontSize="l">Phone Number</Heading>
              <Input variant="flushed" borderRadius="sm" placeholder="Enter phone number" w="60%" />
              <Button colorScheme="blue" mt={2}>Update phone number</Button>
            </VStack>
          </ModalTemplate>

          {/* Password Modal */}
          <Button onClick={onPasswordModalOpen}>Change Password</Button>
            <ModalTemplate title="Change Password" isOpen={isPasswordModalOpen} onClose={onPasswordModalClose}>
              <Flex direction="column" mb={4}>
                <Heading mb={2} fontSize="l">Current password</Heading>
                <Input variant="flushed" type="password" borderRadius="sm" placeholder="******" w="100%" />
              </Flex>
              <Flex direction="column" mb={4}>
                <Heading mb={2} fontSize="l">New password</Heading>
                <Input variant="flushed" type="password" borderRadius="sm" placeholder="******" w="100%" />
              </Flex>
              <Flex direction="column" mb={4}>
                <Heading mb={2} fontSize="l">Confirm new password</Heading>
                <Input variant="flushed" type="password" borderRadius="sm" placeholder="******" w="100%" />
              </Flex>
            </ModalTemplate>
        </HStack>


      {/* Delete Account Section */}
      <Heading fontSize="xl" mb={4}>Delete Account</Heading>
      <Heading fontSize="sm" mb={4}>If you no longer want to use Textifai, you can permenantly delete your account. You can't undo this action.</Heading>
      {/* Delete Account Section */}
      <Button 
          colorScheme="red" 
          variant="outline" 
          leftIcon={<Icon as={AiFillExclamationCircle} />}
          onClick={handleDeleteAccount}    
      >
          Delete Account
      </Button>
      </Box>
      );
  };
  
  export default AccountSettings;
  