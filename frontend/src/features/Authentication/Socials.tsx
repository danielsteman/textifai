import { VStack } from "@chakra-ui/react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import {
  AuthProvider,
  LoginOrRegisterModalProps,
} from "./LoginOrRegisterModal";
import SocialLoginButton from "./SocialLoginButton";

export interface SocialsProps extends LoginOrRegisterModalProps {}

const Socials: React.FC<SocialsProps> = (props) => {
  const renderSocialLoginButton = (authProviders: AuthProvider) => {
    switch (authProviders) {
      case "google":
        return (
          <SocialLoginButton
            socialMediaProvider={"Google"}
            icon={FaGoogle}
            color={"#D84B37"}
            {...props}
          />
        );
      case "facebook":
        return (
          <SocialLoginButton
            socialMediaProvider={"Facebook"}
            icon={FaFacebook}
            color={"#1877F2"}
            {...props}
          />
        );
    }
  };
  return (
    <VStack>
      {props.authProviders.map((authProvider) =>
        renderSocialLoginButton(authProvider)
      )}
    </VStack>
  );
};

export default Socials;
