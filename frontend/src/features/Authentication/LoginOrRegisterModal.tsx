import { AtSignIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
  FormErrorMessage,
  InputRightElement,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
  Spinner,
  Text,
  Center,
} from "@chakra-ui/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useCallback, useState } from "react";
import auth from "../../app/config/firebase";
import Socials from "./Socials";

export interface LoginOrRegisterModalProps {
  loginOrRegister: "signIn" | "signUp";
}

const LoginOrRegisterModal: React.FC<LoginOrRegisterModalProps> = (props) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = useCallback(
    async (e: any) => {
      setAttempts(attempts + 1);
      setLoading(true);
      e.preventDefault();
      try {
        switch (props.loginOrRegister) {
          case "signUp":
            await createUserWithEmailAndPassword(auth, email, password);
          case "signIn":
            await signInWithEmailAndPassword(auth, email, password);
        }
        onClose();
      } catch (error: any) {
        // TODO: convert error to something that's user friendly (use table: https://firebase.google.com/docs/auth/admin/errors)
        console.log(error.message);
        setError(error.message);
      }
      setLoading(false);
    },
    [email, password]
  );

  const missingEmailError = email === "" && attempts >= 1;
  const missingPasswordError = password === "" && attempts >= 1;

  const handleShowPassword = () => setShowPassword(!showPassword);
  const buttonProps =
    props.loginOrRegister === "signUp"
      ? { text: "Sign up", variant: "outline" }
      : { text: "Sign in", variant: "solid" };

  return (
    <>
      <Button size="sm" onClick={onOpen} variant={buttonProps.variant}>
        {buttonProps.text}
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent pb={4}>
          <ModalHeader>{buttonProps.text}</ModalHeader>
          <ModalCloseButton />
          <form>
            <ModalBody>
              <VStack spacing={2}>
                <FormControl isInvalid={missingEmailError}>
                  <InputGroup size="md">
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<AtSignIcon color="gray.300" />}
                    />
                    <Input
                      value={email}
                      onChange={handleChangeEmail}
                      placeholder="Enter email address"
                      type="email"
                    />
                  </InputGroup>
                  {missingEmailError && (
                    <FormErrorMessage>Email is required.</FormErrorMessage>
                  )}
                </FormControl>
                <FormControl isInvalid={missingPasswordError}>
                  <InputGroup size="md">
                    <InputLeftElement
                      pointerEvents="none"
                      color="gray.300"
                      children={<LockIcon color="gray.300" />}
                    />
                    <Input
                      value={password}
                      onChange={handleChangePassword}
                      pr="4.5rem"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                    />
                    <InputRightElement width="4.5rem">
                      <Button
                        h="1.75rem"
                        size="sm"
                        onClick={handleShowPassword}
                      >
                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
                  {missingPasswordError && (
                    <FormErrorMessage>Password is required.</FormErrorMessage>
                  )}
                </FormControl>
                {props.loginOrRegister === "signUp" && (
                  <>
                    <FormControl>
                      <InputGroup>
                        <InputLeftElement
                          pointerEvents="none"
                          color="gray.300"
                          children={<LockIcon color="gray.300" />}
                        />
                        <Input
                          placeholder="Repeat password"
                          type={showPassword ? "text" : "password"}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <InputGroup>
                        <Input placeholder="First name" />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <InputGroup>
                        <Input placeholder="Last name" />
                      </InputGroup>
                    </FormControl>
                  </>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              {error !== "" && <Text>{error}</Text>}
              {loading ? (
                <Spinner size="md" />
              ) : (
                <Button
                  type="submit"
                  onClick={handleSubmit}
                  isDisabled={email === "" || password === ""}
                >
                  {buttonProps.text}
                </Button>
              )}
            </ModalFooter>
          </form>
          <Center>
            <VStack>
              <Text fontWeight={600} mb={2}>
                Or
              </Text>
              <Socials {...props} />
            </VStack>
          </Center>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginOrRegisterModal;
