import {
  Avatar,
  Box,
  ButtonGroup,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import LoginOrRegisterModal from "../components/LoginOrRegisterModal";
import Logo from "../components/Logo";
import LogoutButton from "../components/LogoutButton";
import NavigationButton from "../components/NavigationButton";
import { AuthContext } from "../providers/AuthProvider";

const Header = () => {
  const currentUser = useContext(AuthContext);

  return (
    <>
      <Flex py={2} px={8} gap={4} direction="row" alignItems="center">
        <Logo />
        <Box w={8}/>
        <ButtonGroup>
          <NavigationButton to="/products">Products</NavigationButton>
          <NavigationButton to="/docs">Docs</NavigationButton>
          <NavigationButton to="/pricing">Pricing</NavigationButton>
          <NavigationButton to="/support">Support</NavigationButton>
        </ButtonGroup>
        <Spacer />
        {currentUser 
        ? <>
            <Avatar bg='teal.500' size="sm"/>
            <LogoutButton />
          </>
        : <>
            <ButtonGroup>
              <LoginOrRegisterModal variant="signin" />
              <LoginOrRegisterModal variant="signup" />
            </ButtonGroup>
          </>
         }
      </Flex>
      <Outlet />
    </>
  );
};

export default Header;
