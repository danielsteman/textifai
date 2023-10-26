import {
  Button,
  Checkbox,
  HStack,
  Modal,
  Text,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  keyframes,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect } from "react";

const CtaButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    const shouldOpen = localStorage.getItem("showNewsLetterOffer");
    if (!shouldOpen || JSON.parse(shouldOpen) === true) {
      onOpen();
    }
  }, []);

  const animation = keyframes`
    to {
       background-position: 200%;
     }
  `;
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Welcome!</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>
            Upload PDF documents. Textifai is a text analytics platform so we
            only accept text based documents, for now... Sign up to our
            newsletter to receive updates about new features!
          </Text>
        </ModalBody>
        <ModalFooter justifyContent="center">
          <VStack gap={4} p={0}>
            <HStack p={0}>
              <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                bgGradient="linear(to-l, #7928CA,#FF0080)"
                fontSize="md"
                backgroundSize="200% auto"
                animation={`${animation} 2s ease-in-out infinite alternate`}
                colorScheme="blue"
                textColor="white"
              >
                Sign up for newsletter
              </Button>
            </HStack>
            <Checkbox
              value="dontShowAgain"
              onChange={(e) => {
                localStorage.setItem(
                  "showNewsLetterOffer",
                  JSON.stringify(!e.target.checked)
                );
                console.log(e.target.checked);
              }}
            >
              Don't show again
            </Checkbox>
          </VStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CtaButton;
