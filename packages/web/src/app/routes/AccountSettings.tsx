import {
  Box,
  Heading,
  Input,
  Button,
  Avatar,
  Icon,
  VStack,
  useColorMode,
  FormControl,
  InputGroup,
  FormErrorMessage,
  Tooltip,
  HStack,
  FormLabel,
} from "@chakra-ui/react";
import { AiFillExclamationCircle } from "react-icons/ai";
import { deleteUser } from "firebase/auth";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../../app/themes/theme";
import { User } from "@shared/interfaces/firebase/User";
import { AuthContext } from "../providers/AuthProvider";
import { getUser, updateUser } from "../../common/firestoreHelpers/users";

const AccountSettings = () => {
  const [user, setUser] = useState<User | undefined>();
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [attempts, setAttempts] = useState<number>(0);

  const currentUser = useContext(AuthContext);

  useEffect(() => {
    getUser(currentUser!.uid).then((userObject) => setUser(userObject));
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      console.log(file);
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setAttempts(attempts + 1);
    await updateUser(currentUser?.uid!, { firstName, lastName });
    getUser(currentUser!.uid).then((userObject) => setUser(userObject));
  };

  const { colorMode } = useColorMode();

  const navigate = useNavigate();

  const handleDeleteAccount = () => {
    if (currentUser) {
      deleteUser(currentUser)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.warn("Failed to delete account!");
          console.error(error);
        });
    } else {
      console.warn("User not found!");
    }
  };

  const missingFirstName = firstName === "" && attempts >= 1;
  const missingLastName = lastName === "" && attempts >= 1;

  return (
    <VStack
      align="flex-start"
      justify="flex-start"
      p={6}
      bgColor={theme.colors[colorMode].surfaceContainer}
      borderRadius={8}
      m="auto"
      gap={4}
    >
      <Button
        variant="ghost"
        size="sm"
        position="absolute"
        top={"2em"}
        right={"2em"}
        onClick={() => navigate("/features/workspace")}
      >
        Cancel
      </Button>
      <Heading fontSize="2xl" mb={4}>
        Account settings
      </Heading>

      <HStack gap={8}>
        <Box position="relative">
          {user && (
            <Tooltip label="Click to upload an avatar">
              <Avatar
                size="2xl"
                name={`${user!.firstName} ${user!.lastName}`}
                src={user!.avatarUrl}
                bgColor={theme.colors[colorMode].primary}
                onClick={() => fileInputRef.current?.click()}
                cursor="pointer"
                _hover={{
                  bgColor: theme.colors[colorMode].primaryFixed,
                  transitionDuration: "0.5s",
                  transitionTimingFunction: "ease-in-out",
                }}
              />
            </Tooltip>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </Box>
        <form onSubmit={handleSubmit}>
          <VStack gap={2} alignItems="start">
            <FormControl isInvalid={missingFirstName}>
              <FormLabel>First name</FormLabel>
              <InputGroup size="md">
                <Input
                  value={firstName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFirstName(e.target.value);
                  }}
                  placeholder={user?.firstName}
                  bgColor={theme.colors[colorMode].surfaceContainerHigh}
                  isRequired
                />
              </InputGroup>
              {missingFirstName && (
                <FormErrorMessage>First name is required.</FormErrorMessage>
              )}
            </FormControl>
            <FormControl isInvalid={missingLastName}>
              <FormLabel>Last name</FormLabel>
              <InputGroup size="md">
                <Input
                  value={lastName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setLastName(e.target.value);
                  }}
                  placeholder={user?.lastName}
                  bgColor={theme.colors[colorMode].surfaceContainerHigh}
                  isRequired
                />
              </InputGroup>
              {missingLastName && (
                <FormErrorMessage>Last name is required.</FormErrorMessage>
              )}
            </FormControl>
            <Button type="submit" mt={4}>
              Save
            </Button>
            <Tooltip
              label="If you no longer want to use Textifai, you can permenantly delete your
        account. You can't undo this action."
            >
              <Button
                colorScheme="red"
                variant="outline"
                leftIcon={<Icon as={AiFillExclamationCircle} />}
                onClick={handleDeleteAccount}
                mt={8}
              >
                Delete Account
              </Button>
            </Tooltip>
          </VStack>
        </form>
      </HStack>
    </VStack>
  );
};

export default AccountSettings;
