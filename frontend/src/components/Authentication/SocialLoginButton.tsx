import { Text, HStack, Icon } from "@chakra-ui/react";
import React from "react";
import { IconType } from "react-icons";
import { Color } from "../../shared/app.types";

interface Props {
  variant: "Facebook" | "Google";
  icon: IconType;
  color: Color;
}

const SocialLoginButton: React.FC<Props> = (props) => {
  return (
    <HStack bgColor={props.color} p={2} rounded={5} w={200}>
      <Icon as={props.icon} color="white" boxSize={5} />
      <Text color={"white"} fontWeight={600}>
        Login with {props.variant}
      </Text>
    </HStack>
  );
};

export default SocialLoginButton;
