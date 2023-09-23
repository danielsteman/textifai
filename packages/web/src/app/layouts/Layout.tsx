import { Box, ButtonGroup, Flex, Spacer } from "@chakra-ui/react";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import AccountInfoDrawer from "../../features/AccountMenuDrawer/AccountMenuDrawer";
import Navigation from "../../features/Navigation/Navigation";
import Logo from "../../common/components/Logo";
import LoginOrRegisterModal from "../../features/Authentication/LoginOrRegisterModal";
import { AuthContext } from "../providers/AuthProvider";

interface LayoutProps {
  promoComponent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ promoComponent }) => {
  const currentUser = useContext(AuthContext);

  return (
    <Flex direction="column" h="100%">
      {promoComponent}
      <Flex py={2} px={8} gap={4} direction="row" alignItems="center">
        <Logo />
        <Box w={8} />
        <Navigation />
        <Spacer />
        {currentUser ? (
          <>
            <AccountInfoDrawer />
          </>
        ) : (
          <ButtonGroup>
            <LoginOrRegisterModal
              loginOrRegister="signIn"
              authProviders={["google"]}
            />
            <LoginOrRegisterModal
              loginOrRegister="signUp"
              authProviders={["google"]}
            />
          </ButtonGroup>
        )}
      </Flex>
      <Outlet />
    </Flex>
  );
};

export default Layout;
