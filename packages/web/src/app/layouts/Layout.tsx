import { Box, Button, ButtonGroup, Flex, Spacer } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
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
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  
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
            isOpen={isSignInModalOpen}
            onClose={() => setIsSignInModalOpen(false)}
            onSignInClick={() => setIsSignInModalOpen(true)}
            onSignUpClick={() => {
              setIsSignInModalOpen(false);
              setIsSignUpModalOpen(true);
            }}
          />
          
          <LoginOrRegisterModal
            loginOrRegister="signUp"
            authProviders={["google"]}
            isOpen={isSignUpModalOpen}
            onClose={() => setIsSignUpModalOpen(false)}
            onSignUpClick={() => {
              setIsSignInModalOpen(false);
              setIsSignUpModalOpen(true);
              }
            }
          />
        </ButtonGroup>
        )}
      </Flex>
      <Outlet />
    </Flex>
  );
};

export default Layout;
