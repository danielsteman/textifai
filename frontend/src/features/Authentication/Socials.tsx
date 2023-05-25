import { VStack } from "@chakra-ui/react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import {
  AuthProvider,
  LoginOrRegisterModalProps,
} from "./LoginOrRegisterModal";
import SocialLoginButton from "./SocialLoginButton";

export interface SocialsProps extends LoginOrRegisterModalProps {}

const Socials: React.FC<SocialsProps> = (props) => {
  const renderSocialLoginButton = (
    authProviders: AuthProvider,
    index: number
  ) => {
    switch (authProviders) {
      case "google":
        return (
          <SocialLoginButton
            key={index}
            socialMediaProvider={"Google"}
            icon={FaGoogle}
            color={"#D84B37"}
            {...props}
          />
        );
      case "facebook":
        return (
          <SocialLoginButton
            key={index}
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
      {props.authProviders.map((authProvider, index) =>
        renderSocialLoginButton(authProvider, index)
      )}
    </VStack>
  );
};

export default Socials;
