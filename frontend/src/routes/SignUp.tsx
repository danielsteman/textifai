import auth from "../config/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useCallback, useState } from "react";
import {
  InputGroup,
  Input,
  InputRightElement,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  InputLeftElement,
} from "@chakra-ui/react";
import { AtSignIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const navigate = useNavigate();

  const handleSignUpHook = useCallback(
    async (e: any) => {
      e.preventDefault();
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/");
      } catch (error) {
        alert(error);
      }
    },
    [navigate]
  );

  const missingEmailError = email === "";
  const missingPasswordError = password === "";
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
        <Button type="submit" onClick={handleSignUpHook}>
          Sign up
        </Button>
      </FormControl>
    </form>
  );
};

export default SignUp;
