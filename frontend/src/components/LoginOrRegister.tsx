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
} from "@chakra-ui/react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router";
import auth from "../config/firebase";

interface Props {
  variant: "login" | "register";
}

const LoginOrRegister: React.FC<Props> = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const navigate = useNavigate();

  const handleSubmit = useCallback(
    async (e: any) => {
      setAttempts(attempts + 1);
      e.preventDefault();
      try {
        switch (props.variant) {
          case "register":
            await createUserWithEmailAndPassword(auth, email, password);
          case "login":
            await signInWithEmailAndPassword(auth, email, password);
        }
        navigate("/");
      } catch (error) {
        alert(error);
      }
    },
    [navigate, email, password]
  );

  const missingEmailError = email === "" && attempts >= 1;
  const missingPasswordError = password === "" && attempts >= 1;
  const handleShowPassword = () => setShowPassword(!showPassword);

  return (
    <form>
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
          {!missingEmailError ? (
            <FormHelperText>
              Enter the email address you'd like to use for signing up.
            </FormHelperText>
          ) : (
            <FormErrorMessage>Email is required.</FormErrorMessage>
          )}
        </InputGroup>
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
            <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
              {showPassword ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
        {!missingPasswordError ? (
          <FormHelperText>
            Enter the password you'd like to use for future logins.
          </FormHelperText>
        ) : (
          <FormErrorMessage>Password is required.</FormErrorMessage>
        )}
        <Button type="submit" onClick={handleSubmit}>
          {props.variant === "register" ? "Sign up" : "Login"}
        </Button>
      </FormControl>
    </form>
  );
};

export default LoginOrRegister;
