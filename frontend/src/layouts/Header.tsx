import {
  Avatar,
  Button,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import LoginOrRegisterModal from "../components/LoginOrRegisterModal";
import Logo from "../components/Logo";
import { AuthContext } from "../providers/AuthProvider";

const Header = () => {
  const currentUser = useContext(AuthContext);
  console.log(currentUser);

  return (
    <>
      <Flex p={2} gap={2} direction="row" alignItems="center">
        <Logo />
        <Button size="sm">Templates</Button>
        <Button size="sm">Docs</Button>
        <Button size="sm">Pricing</Button>
        <Spacer />
        {currentUser 
        ? <Avatar bg='teal.500' /> 
        : <>
            <LoginOrRegisterModal variant="signin" />
            <LoginOrRegisterModal variant="signup" />
          </>
         }
      </Flex>
      <Outlet />
    </>
  );
};

export default Header;
