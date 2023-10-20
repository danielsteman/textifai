import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  Spacer,
  useColorMode,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import AccountInfoDrawer from "../../features/AccountMenuDrawer/AccountMenuDrawer";
import Navigation from "../../features/Navigation/Navigation";
import Logo from "../../common/components/Logo";
import LoginOrRegisterModal from "../../features/Authentication/LoginOrRegisterModal";
import { AuthContext } from "../providers/AuthProvider";
import theme from "../themes/theme";

interface LayoutProps {
  promoComponent?: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ promoComponent }) => {
  const currentUser = useContext(AuthContext);
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const { colorMode } = useColorMode();

  return (
    <Flex direction="column" h="100%">
      {promoComponent}
      <Flex
        py={6}
        px={10}
        gap={4}
        direction="row"
        alignItems="center"
        bgColor={theme.colors[colorMode].surfaceContainerLow}
      >
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
