import { AtSignIcon, LockIcon, ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
  FormErrorMessage,
  InputRightElement,
  Button,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

const LoginFormFields = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [attempts, setAttempts] = useState<number>(0);
  const missingEmailError = email === "" && attempts >= 1;
  const missingPasswordError = password === "" && attempts >= 1;
  const handleShowPassword = () => setShowPassword(!showPassword);

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <>
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
            <Button h="1.75rem" size="sm" onClick={handleShowPassword}>
              {showPassword ? <ViewIcon /> : <ViewOffIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
        {missingPasswordError && (
          <FormErrorMessage>Password is required.</FormErrorMessage>
        )}
      </FormControl>
    </>
  );
};

export default LoginFormFields;
