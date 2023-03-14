import { HStack, VStack, Heading, Icon, Text } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface Props {
  children: React.ReactNode; // TODO: should be restricted to string
  headerText: string;
  icon: IconType;
}

const SettingsMenuItem: React.FC<Props> = ({ children, headerText, icon }) => {
  return (
    <HStack>
      <Icon as={icon} />
      <VStack>
        <Heading size="sm">{headerText}</Heading>
        <Text>{children}</Text>
      </VStack>
    </HStack>
  );
};

export default SettingsMenuItem;
