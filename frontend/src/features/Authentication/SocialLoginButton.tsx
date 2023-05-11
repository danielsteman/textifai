import { Text, Icon, Button } from "@chakra-ui/react";
import { getRedirectResult, signInWithRedirect } from "firebase/auth";
import React from "react";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";
import { facebookProvider } from "../../app/auth/auth_facebook_provider_create";
import { googleProvider } from "../../app/auth/auth_google_provider_create";
import auth from "../../app/config/firebase";
import { formatPropString } from "../../common/utils/formatStrings";
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
  const navigate = useNavigate();
  const handleSubmit = () => {
    switch (props.socialMediaProvider) {
      case "Google": {
        signInWithRedirect(auth, googleProvider);
        getRedirectResult(auth)
          .then(() => {
            navigate("/products");
          })
          .catch((error) => {
            console.log(error);
          });
      }
      case "Facebook": {
        signInWithRedirect(auth, facebookProvider);
        getRedirectResult(auth)
          .then(() => {
            navigate("/products");
          })
          .catch((error) => {
            console.log(error);
          });
      }
      default: {
        console.log(
          "socialMediaProvider in SocialLoginButtonProps was not matched"
        );
      }
    }
  };
  return (
    <Button
      onClick={handleSubmit}
      colorScheme={props.socialMediaProvider.toLowerCase()}
      p={2}
      rounded={5}
      w="100%"
    >
      <Icon as={props.icon} color="white" boxSize={5} mr={2} />
      <Text color={"white"} fontWeight={600}>
        {formattedButtonText}
      </Text>
    </Button>
  );
};

export default SocialLoginButton;
