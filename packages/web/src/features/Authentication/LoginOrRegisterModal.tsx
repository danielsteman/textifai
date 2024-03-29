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
  VStack,
  Spinner,
  Text,
  Center,
  Divider,
  Flex,
  useColorMode,
} from "@chakra-ui/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { useCallback, useState } from "react";
import { auth, db } from "../../app/config/firebase";
import Socials from "./Socials";
import AuthError from "./AuthError";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Timestamp, collection, doc, setDoc } from "firebase/firestore";
import { User } from "@shared/interfaces/firebase/User";
import { Project } from "@shared/interfaces/firebase/Project";
import theme from "../../app/themes/theme";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "src/app/store";
import {
  closeSignInModal,
  closeSignUpModal,
  openSignInModal,
  openSignUpModal,
} from "./loginOrRegisterModalSlice";

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
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [isForgotPassword, setIsForgotPassword] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { colorMode } = useColorMode();

  const onOpen =
    props.loginOrRegister === "signIn"
      ? () => dispatch(openSignInModal())
      : () => dispatch(openSignUpModal());
  const onClose =
    props.loginOrRegister === "signIn"
      ? () => dispatch(closeSignInModal())
      : () => dispatch(closeSignUpModal());
  const openState =
    props.loginOrRegister === "signIn"
      ? useSelector(
          (state: RootState) => state.loginOrRegisterModal.openSignInModal
        )
      : useSelector(
          (state: RootState) => state.loginOrRegisterModal.openSignUpModal
        );

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
            const userCredential = await createUserWithEmailAndPassword(
              auth,
              email,
              password
            );

            if (userCredential.user) {
              sendEmailVerification(userCredential.user);
            }

            const userData: User = {
              userId: userCredential.user.uid,
              firstName: firstname,
              lastName: lastname,
              email: email,
              admin: [],
              avatarUrl: "",
              createdDate: Timestamp.fromDate(new Date()),
              updatedDate: Timestamp.fromDate(new Date()),
              language: "english",
              isActive: true,
            };

            const userDocRef = doc(db, "users", userCredential.user.uid);
            await setDoc(userDocRef, userData);

            const projectData: Project = {
              name: "My Project",
              description: "This is my first project.",
              industry: "",
              users: [userCredential.user.uid],
              creationDate: Timestamp.fromDate(new Date()),
            };

            const projectDocRef = doc(collection(db, "projects"));

            await setDoc(projectDocRef, projectData);
            await updateProfile(userCredential.user, {
              displayName: `${firstname} ${lastname}`,
            });
            navigate("/email-verification");
            break;

          case "signIn":
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/features/workspace");
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
      ? {
          text: "Sign up",
          variant: "solid",
          style: {
            color: theme.colors[colorMode].onPrimary,
            bgColor: theme.colors[colorMode].primary,
            borderRadius: 24,
            w: 24,
          },
        }
      : {
          text: "Login",
          variant: "outline",
          style: {
            color: theme.colors[colorMode].primary,
            borderRadius: 24,
            w: 24,
          },
        };

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
      <Button
        size="md"
        onClick={() => onOpen()}
        variant={buttonProps.variant}
        {...buttonProps.style}
      >
        {buttonProps.text}
      </Button>
      <Modal isCentered isOpen={openState} onClose={() => onClose()}>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(10px)" />
        <ModalContent pb={4} bgColor={theme.colors[colorMode].surfaceContainer}>
          {isForgotPassword ? (
            <>
              <ModalHeader>Forgot password?</ModalHeader>
              <ModalCloseButton
                onClick={() => setIsForgotPassword(!isForgotPassword)}
              />
              <ModalBody>
                <Text mb={2}>Enter your email to reset your password</Text>{" "}
                <FormControl mt={2}>
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      color={theme.colors[colorMode].primary}
                      children={
                        <AtSignIcon color={theme.colors[colorMode].primary} />
                      }
                    />
                    <Input
                      value={email}
                      onChange={handleChangeEmail}
                      placeholder="Enter email address"
                      type="email"
                      bgColor={theme.colors[colorMode].surfaceContainerHigh}
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
                          children={
                            <AtSignIcon
                              color={theme.colors[colorMode].primary}
                            />
                          }
                        />
                        <Input
                          value={email}
                          onChange={handleChangeEmail}
                          placeholder="Enter email address"
                          type="email"
                          bgColor={theme.colors[colorMode].surfaceContainerHigh}
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
                          color={theme.colors[colorMode].primary}
                          children={
                            <LockIcon color={theme.colors[colorMode].primary} />
                          }
                        />
                        <Input
                          value={password}
                          onChange={handleChangePassword}
                          pr="4.5rem"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter password"
                          bgColor={theme.colors[colorMode].surfaceContainerHigh}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleShowPassword}
                          >
                            {showPassword ? (
                              <ViewIcon
                                color={theme.colors[colorMode].primary}
                              />
                            ) : (
                              <ViewOffIcon
                                color={theme.colors[colorMode].primary}
                              />
                            )}
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
                              color={theme.colors[colorMode].primary}
                              children={
                                <LockIcon
                                  color={theme.colors[colorMode].primary}
                                />
                              }
                            />
                            <Input
                              placeholder="Repeat password"
                              type={showPassword ? "text" : "password"}
                              value={repeatedPassword}
                              onChange={handleChangeRepeatedPassword}
                              bgColor={
                                theme.colors[colorMode].surfaceContainerHigh
                              }
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
                              bgColor={
                                theme.colors[colorMode].surfaceContainerHigh
                              }
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
                              bgColor={
                                theme.colors[colorMode].surfaceContainerHigh
                              }
                            />
                          </InputGroup>
                        </FormControl>
                      </>
                    )}
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <VStack width="100%">
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

                    {props.loginOrRegister === "signIn" && (
                      <VStack gap={2}>
                        <Text mt={4} textAlign="center">
                          Don't have an account yet?
                        </Text>
                        <Button
                          variant="solid"
                          size="sm"
                          onClick={() => {
                            dispatch(closeSignInModal());
                            dispatch(openSignUpModal());
                          }}
                        >
                          Create account
                        </Button>
                      </VStack>
                    )}
                  </VStack>
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
