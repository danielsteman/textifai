import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Flex,
  HStack,
  Icon,
  Spacer,
  Text,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import AccountMenu from "../components/AccountMenu";
import LoginOrRegisterModal from "../components/LoginOrRegisterModal";
import Logo from "../components/Logo";
import NavigationButton from "../components/NavigationButton";
import PromoTiara from "../components/PromoTiara";
import { AuthContext } from "../providers/AuthProvider";

const Header = () => {
  const currentUser = useContext(AuthContext);
  const [showPromo, setShowPromo] = useState<boolean>(true);

  return (
    <>
      {showPromo && (
        <PromoTiara />
      )}
      <Flex py={2} px={8} gap={4} direction="row" alignItems="center">
        <Logo />
        <Box w={8} />
        <ButtonGroup>
          <NavigationButton to="/products">Products</NavigationButton>
          <NavigationButton to="/docs">Docs</NavigationButton>
          <NavigationButton to="/pricing">Pricing</NavigationButton>
          <NavigationButton to="/support">Support</NavigationButton>
        </ButtonGroup>
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
