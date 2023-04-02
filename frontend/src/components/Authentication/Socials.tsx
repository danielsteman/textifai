import { Icon, VStack } from "@chakra-ui/react";
import { FaFacebook, FaGoogle } from "react-icons/fa";

const Socials = () => {
  return (
    <VStack>
      <Icon as={FaFacebook} />
      <Icon as={FaGoogle} />
    </VStack>
  );
};

export default Socials;
