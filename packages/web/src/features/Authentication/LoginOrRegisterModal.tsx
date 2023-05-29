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
import AuthError from "./AuthError";
import { validateEmail } from "../../common/utils/validations";

export type AuthProvider = "facebook" | "google";

export interface LoginOrRegisterModalProps {
  loginOrRegister: "signIn" | "signUp";
  authProviders: AuthProvider[];
}

const LoginOrRegisterModal: React.FC<LoginOrRegisterModalProps> = (props) => {
  const [firstname, setFirstname] = useState<string>("");
  const [lastname, setLastname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [repeatedPassword, setRepeatedPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const handleChangeFirstname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstname(e.target.value);
  };

  const handleChangeLastname = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastname(e.target.value);
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleChangeRepeatedPassword = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRepeatedPassword(e.target.value);
  };

  // how do I stop the function from excuting the 'try' block if validateEmail(email) is false?
  const handleSubmit = useCallback(
    async (e: any) => {
      // if (!validateEmail(email)) {
      //   setError("This email address is invalid.");
      //   return;
      // }
      setAttempts(attempts + 1);
      setLoading(true);
      e.preventDefault();
      try {
        // TODO: create user with first name and last name
        switch (props.loginOrRegister) {
          case "signUp":
            await createUserWithEmailAndPassword(auth, email, password);
          case "signIn":
            await signInWithEmailAndPassword(auth, email, password);
        }
        onClose();
      } catch (error: any) {
        setError(error.code);
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

  const disableSubmitButton = (): boolean => {
    if (props.loginOrRegister === "signIn") {
      return email === "" || password === "";
    } else if (props.loginOrRegister === "signUp") {
      return (
        firstname === "" ||
        lastname === "" ||
        email === "" ||
        password === "" ||
        password !== repeatedPassword
      );
    } else {
      return false;
    }
  };

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
                {error && <AuthError code={error} />}
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
                          value={repeatedPassword}
                          onChange={handleChangeRepeatedPassword}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <InputGroup>
                        <Input
                          placeholder="First name"
                          value={firstname}
                          onChange={handleChangeFirstname}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl>
                      <InputGroup>
                        <Input
                          placeholder="Last name"
                          value={lastname}
                          onChange={handleChangeLastname}
                        />
                      </InputGroup>
                    </FormControl>
                  </>
                )}
              </VStack>
            </ModalBody>
            <ModalFooter>
              {loading ? (
                <Spinner size="md" />
              ) : (
                <Button
                  w="100%"
                  type="submit"
                  onClick={handleSubmit}
                  isDisabled={disableSubmitButton()}
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
