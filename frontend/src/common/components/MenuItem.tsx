import { Icon, Text, Button, Spacer, Flex } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface Props {
  name: string;
  icon: IconType;
}

const MenuItem: React.FC<Props> = ({ name, icon }) => {
  return (
    <Button p={2} size="sm" variant={"ghost"}>
      <Flex alignItems={"left"} w={"100%"}>
        <Text fontSize={"md"}>{name}</Text>
        <Spacer />
        <Icon as={icon} />
      </Flex>
    </Button>
  );
};

export default MenuItem;
