import { HStack, SkeletonCircle } from "@chakra-ui/react";
import React from "react";

const MessageLoadingIndicator = () => {
  return (
    <HStack>
      <SkeletonCircle size="2" />
      <SkeletonCircle size="2" />
      <SkeletonCircle size="2" />
    </HStack>
  );
};

export default MessageLoadingIndicator;
