import { AtSignIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
  FormHelperText,
  FormErrorMessage,
  InputRightElement,
  Button,
  Center,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  HStack,
  VStack,
} from "@chakra-ui/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useCallback, useState } from "react";
import auth from "../config/firebase";

interface Props {
  variant: "signin" | "signup";
}

const LoginOrRegisterModal: React.FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = useCallback(
    async (e: any) => {
      setAttempts(attempts + 1);
      e.preventDefault();
      try {
        switch (props.variant) {
          case "signup":
            await createUserWithEmailAndPassword(auth, email, password);
          case "signin":
            await signInWithEmailAndPassword(auth, email, password);
        }
        onClose();
      } catch (error) {
        alert(error);
      }
    },
    [email, password]
  );

  const missingEmailError = email === "" && attempts >= 1;
  const missingPasswordError = password === "" && attempts >= 1;
  const handleShowPassword = () => setShowPassword(!showPassword);
  const buttonProps =
    props.variant === "signup"
      ? { text: "Sign up", variant: "outline" }
      : { text: "Sign in", variant: "solid" };

  return (
    <>
      <Button size="sm" onClick={onOpen} variant={buttonProps.variant}>
        {buttonProps.text}
      </Button>
      <Modal isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px) hue-rotate(90deg)"
        />
        <ModalContent>
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
              </VStack>
            </ModalBody>
            <ModalFooter>
              <HStack spacing={2}>
                <Button type="submit" onClick={handleSubmit}>
                  {buttonProps.text}
                </Button>
                <Button onClick={onClose}>Close</Button>
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginOrRegisterModal;
