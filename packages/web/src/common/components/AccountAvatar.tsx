import { Avatar, AvatarProps } from "@chakra-ui/react";
import React from "react";

const AccountAvatar: React.FC<AvatarProps> = (props) => {
  return <Avatar bg="teal.500" size="sm" cursor="pointer" {...props} />;
};

export default AccountAvatar;
