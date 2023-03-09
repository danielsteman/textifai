import { Button, Flex, HStack, Icon, Spacer } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";

const Header = () => {
  return (
    <>
      <Flex p={2} gap={2} direction="row" alignItems="center">
        <Logo />
        <Button size="sm">Templates</Button>
        <Button size="sm">Docs</Button>
        <Button size="sm">Pricing</Button>
        <Spacer />
        <Button size="sm">Login</Button>
      </Flex>
      <Outlet />
    </>
  );
};

export default Header;
