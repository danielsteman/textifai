import { Icon, Text, Tooltip, Button, Spacer, Flex } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface Props {
  children: React.ReactNode; // TODO: should be restricted to string
  name: string;
  icon: IconType;
}

const SettingsMenuItem: React.FC<Props> = ({ children, name, icon }) => {
  return (
    <Tooltip label={children}>
      <Button p={2} size="sm" variant={"ghost"}>
        <Flex alignItems={"left"} w={"100%"}>
          <Text>{name}</Text>
          <Spacer />
          <Icon as={icon} />
        </Flex>
      </Button>
    </Tooltip>
  );
};

export default SettingsMenuItem;
