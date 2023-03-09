import { Button, HStack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const Header = () => {
  return (
    <>
      <HStack>
        <Button>Home</Button>
        <Button>About</Button>
        <Button>Docs</Button>
      </HStack>
      <Outlet />
    </>
  );
};

export default Header;
