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
  Divider,
  Flex,
} from "@chakra-ui/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useCallback, useState } from "react";
import { auth, db } from "../../app/config/firebase";
import Socials from "./Socials";
import AuthError from "./AuthError";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { User } from "@shared/firestoreInterfaces/User";

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
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

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

  const handleSubmit = useCallback(
    async (e: any) => {
      setAttempts(attempts + 1);
      setLoading(true);
      e.preventDefault();

      try {
        switch (props.loginOrRegister) {
          case "signUp":
            const userData: User = {
              firstName: firstname,
              lastName: lastname,
              admin: [],
              avatarUrl: "",
              createdDate: Timestamp.fromDate(new Date()),
              updatedDate: Timestamp.fromDate(new Date()),
              language: "english",
              isActive: false,
              projects: [],
            };
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );
            await setDoc(doc(db, "users", userCredential.user.uid), userData);
            break;
          case "signIn":
            await signInWithEmailAndPassword(auth, email, password);
        }
        onClose();
      } catch (error: any) {
        setError(error.code);
      }
      setLoading(false);
    },
    [email, password, firstname, lastname]
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

  const handleForgotPasswordClick = () => {
    setIsForgotPassword(true);
    setFeedback(null);
  };

  const handleResetPassword = async () => {
    if (email === "") {
      setFeedback("Please provide an email.");
      return;
    }

    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      setFeedback("Reset link has been sent to your email!");
      setIsForgotPassword(false);
    } catch (error: any) {
      setFeedback("Error sending reset link. Please try again.");
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
          {isForgotPassword ? (
            // Forgot Password Form
            <>
              <ModalHeader>Forgot password?</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text mb={2}>Enter your email to reset your password</Text>{" "}
                {/* You can adjust this value for the desired spacing */}
                <FormControl mt={2}>
                  {" "}
                  {/* Add margin-top to the FormControl */}
                  <InputGroup>
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
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Center width="100%">
                  <Button onClick={handleResetPassword}>Reset Password</Button>
                </Center>
              </ModalFooter>
            </>
          ) : (
            // Login/Register Form
            <>
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
                        <FormErrorMessage>
                          Password is required.
                        </FormErrorMessage>
                      )}
                    </FormControl>
                    {props.loginOrRegister === "signIn" && (
                      <Button
                        variant="link"
                        onClick={handleForgotPasswordClick}
                      >
                        Forgot password?
                      </Button>
                    )}
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
                              type="text"
                              placeholder="First name"
                              value={firstname}
                              onChange={(e) => setFirstname(e.target.value)}
                            />
                          </InputGroup>
                        </FormControl>
                        <FormControl>
                          <InputGroup>
                            <Input
                              type="text"
                              placeholder="Last name"
                              value={lastname}
                              onChange={(e) => setLastname(e.target.value)}
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
            </>
          )}
          <Center mt={4}>
            <Flex align="center" width="100%" my={2}>
              <Divider flex="1" borderColor="gray.600" borderWidth="0.01rem" />
              <Text mx={4} fontWeight={600}>
                or
              </Text>
              <Divider flex="1" borderColor="gray.600" borderWidth="0.01rem" />
            </Flex>
          </Center>
          <Center>
            <VStack>
              <Socials {...props} />
            </VStack>
          </Center>
        </ModalContent>
      </Modal>
    </>
  );
};

export default LoginOrRegisterModal;
