import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  useDisclosure,
  Center,
} from "@chakra-ui/react";
import { useContext, useEffect } from "react";
import { Outlet } from "react-router-dom";
import LoginOrRegister from "../components/LoginOrRegister";
import Logo from "../components/Logo";
import { AuthContext } from "../providers/AuthProvider";

const Header = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const currentUser = useContext(AuthContext);

  return (
    <>
      <Flex p={2} gap={2} direction="row" alignItems="center">
        <Logo />
        <Button size="sm">Templates</Button>
        <Button size="sm">Docs</Button>
        <Button size="sm">Pricing</Button>
        <Spacer />
        <Button size="sm" onClick={onOpen}>
          Login
        </Button>
        <Modal isCentered isOpen={isOpen} onClose={onClose}>
          <ModalOverlay
            bg="blackAlpha.300"
            backdropFilter="blur(10px) hue-rotate(90deg)"
          />
          <ModalContent>
            <Center>
              <ModalHeader>Login</ModalHeader>
            </Center>
            <ModalCloseButton />
            <ModalBody>
              <LoginOrRegister variant="login" />
            </ModalBody>
            <ModalFooter>
              <Button onClick={onClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Flex>
      <Outlet />
    </>
  );
};

export default Header;
