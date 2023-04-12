import { Text, HStack, Icon } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { Color } from "../../shared/app.types";
import formatPropString from "../../utils/formatPropString";
import { SocialsProps } from "./Socials";

interface SocialLoginButtonProps extends SocialsProps {
  socialMediaProvider: "Facebook" | "Google";
  icon: IconType;
  color: Color;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = (props) => {
  const buttonText = `${props.loginOrRegister} with ${props.socialMediaProvider}`;
  const formattedButtonText = formatPropString(buttonText);
  return (
    <HStack bgColor={props.color} p={2} rounded={5} w={"fit-content"}>
      <Icon as={props.icon} color="white" boxSize={5} />
      <Text color={"white"} fontWeight={600}>
        {formattedButtonText}
      </Text>
    </HStack>
  );
};

export default SocialLoginButton;
