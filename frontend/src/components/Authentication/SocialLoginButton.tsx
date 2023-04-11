import { Text, HStack, Icon } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { Color } from "../../shared/app.types";
import { SocialsProps } from "./Socials";

interface SocialLoginButtonProps extends SocialsProps {
  socialMediaProvider: "Facebook" | "Google";
  icon: IconType;
  color: Color;
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = (props) => {
  const buttonText = `${props.loginOrRegister} with ${props.socialMediaProvider}`;
  const formattedLoginOrRegister = "";
  return (
    <HStack bgColor={props.color} p={2} rounded={5} w={"fit-content"}>
      <Icon as={props.icon} color="white" boxSize={5} />
      <Text color={"white"} fontWeight={600}>
        {buttonText}
      </Text>
    </HStack>
  );
};

export default SocialLoginButton;
