import { Button, Flex, HStack, Icon, Spacer } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";

const Header = () => {
  return (
    <>
      <Flex p={2}>
        <HStack>
          <Logo />
          <Button size="sm">Templates</Button>
          <Button size="sm">Docs</Button>
          <Button size="sm">Pricing</Button>
        </HStack>
        <Spacer />
        <Button size="sm">Login</Button>
      </Flex>
      <Outlet />
    </>
  );
};

export default Header;
