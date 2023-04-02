import { Box, ButtonGroup, Flex, Spacer } from "@chakra-ui/react";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";
import LoginOrRegisterModal from "../components/Authentication/LoginOrRegisterModal";
import Logo from "../components/Logo";
import Navigation from "../components/Navigation/Navigation";
import PromoTiara from "../components/PromoTiara";
import { AuthContext } from "../providers/AuthProvider";

const Header = () => {
  const currentUser = useContext(AuthContext);

  return (
    <>
      <PromoTiara />
      <Flex py={2} px={8} gap={4} direction="row" alignItems="center">
        <Logo />
        <Box w={8} />
        <Navigation />
        <Spacer />
        {currentUser ? (
          <>
            <AccountMenu />
          </>
        ) : (
          <>
            <ButtonGroup>
              <LoginOrRegisterModal variant="signin" />
              <LoginOrRegisterModal variant="signup" />
            </ButtonGroup>
          </>
        )}
      </Flex>
      <Outlet />
    </>
  );
};

export default Header;
