import { Text, Icon, Button } from "@chakra-ui/react";
import { signInWithRedirect } from "firebase/auth";
import React from "react";
import { IconType } from "react-icons";
import { googleProvider } from "../../app/auth/auth_google_provider_create";
import auth from "../../app/config/firebase";
import formatPropString from "../../common/utils/formatPropString";
import { Color } from "../../shared/app.types";

import { SocialsProps } from "./Socials";

interface SocialLoginButtonProps extends SocialsProps {
  socialMediaProvider: "Facebook" | "Google";
  icon: IconType;
  color: Color;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = (props) => {
  const buttonText = `${props.loginOrRegister} with ${props.socialMediaProvider}`;
  const formattedButtonText = formatPropString(buttonText);
  const handleSubmit = () => {
    switch(props.socialMediaProvider) {
      case "Google": {
        console.log("logging in with Google");
        signInWithRedirect(auth, googleProvider);
      }
    }
  }
  return (
    <Button onClick={handleSubmit} colorScheme={props.socialMediaProvider.toLowerCase()} p={2} rounded={5} >
      <Icon as={props.icon} color="white" boxSize={5} mr={2}/>
      <Text color={"white"} fontWeight={600}>
        {formattedButtonText}
      </Text>
    </Button>
  );
};

export default SocialLoginButton;
