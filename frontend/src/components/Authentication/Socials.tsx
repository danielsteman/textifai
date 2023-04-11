import { VStack } from "@chakra-ui/react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { LoginOrRegisterModalProps } from "./LoginOrRegisterModal";
import SocialLoginButton from "./SocialLoginButton";

export interface SocialsProps extends LoginOrRegisterModalProps {}

const Socials: React.FC<SocialsProps> = (props) => {
  return (
    <VStack>
      <SocialLoginButton
        socialMediaProvider={"Facebook"}
        icon={FaFacebook}
        color={"#1877F2"}
        {...props}
      />
      <SocialLoginButton
        socialMediaProvider={"Google"}
        icon={FaGoogle}
        color={"#D84B37"}
        {...props}
      />
    </VStack>
  );
};

export default Socials;
