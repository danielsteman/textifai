import { SmallCloseIcon } from "@chakra-ui/icons";
import { Tab, IconButton } from "@chakra-ui/react";

interface Props {
  name: string;
  onOpen: (tab: string) => void;
  onClose: (tab: string) => void;
}

const CustomTab: React.FC<Props> = (props) => {
  return (
    <Tab position="relative">
      {props.name}
      <IconButton
        variant="ghost"
        position="absolute"
        right={2}
        size="xs"
        aria-label={"close"}
        icon={<SmallCloseIcon />}
      />
    </Tab>
  );
};

export default CustomTab;
