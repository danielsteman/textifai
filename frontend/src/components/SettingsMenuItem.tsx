import { HStack, VStack, Heading, Icon, Text, Tooltip } from "@chakra-ui/react";
import { IconType } from "react-icons";

interface Props {
  children: React.ReactNode; // TODO: should be restricted to string
  headerText: string;
  icon: IconType;
}

const SettingsMenuItem: React.FC<Props> = ({ children, headerText, icon }) => {
  return (
    <Tooltip label={children}>
      <HStack m={4} p={2} bgColor="grey" rounded={4}>
        <Icon as={icon} />
        <VStack>
          <Heading size="sm">{headerText}</Heading>
        </VStack>
      </HStack>
    </Tooltip>
  );
};

export default SettingsMenuItem;
