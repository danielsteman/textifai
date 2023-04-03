import { VStack } from "@chakra-ui/react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import SocialLoginButton from "./SocialLoginButton";

const Socials = () => {
  return (
    <VStack>
      <SocialLoginButton
        variant={"Facebook"}
        icon={FaFacebook}
        color={"#1877F2"}
      />
      <SocialLoginButton variant={"Google"} icon={FaGoogle} color={"#D84B37"} />
    </VStack>
  );
};

export default Socials;
