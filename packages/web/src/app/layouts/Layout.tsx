import {
  Box,
  ButtonGroup,
  Flex,
  Spacer,
  useBreakpointValue,
  useColorMode,
} from "@chakra-ui/react";
import { useContext } from "react";
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
  const { colorMode } = useColorMode();
  const isMobile = useBreakpointValue({ base: true, sm: false });

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
        position="sticky"
        top={0}
        zIndex={1}
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
          !isMobile && (
            <ButtonGroup>
              <LoginOrRegisterModal
                loginOrRegister="signUp"
                authProviders={["google"]}
              />
              <LoginOrRegisterModal
                loginOrRegister="signIn"
                authProviders={["google"]}
              />
            </ButtonGroup>
          )
        )}
      </Flex>
      <Outlet />
    </Flex>
  );
};

export default Layout;
