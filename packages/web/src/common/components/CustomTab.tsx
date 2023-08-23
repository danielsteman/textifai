import { SmallCloseIcon } from "@chakra-ui/icons";
import { Tab, IconButton } from "@chakra-ui/react";

interface Props {
  name: string;
  onOpen: (tab: string) => void;
  onClose: (tab: string) => void;
}

const CustomTab: React.FC<Props> = (props) => {
  return (
    <>
      <Tab _hover={{ background: "lightgrey" }}>{props.name}</Tab>
      <IconButton
        variant="ghost"
        right={9}
        borderRadius={20}
        top={1}
        size="sm"
        aria-label={"close"}
        icon={<SmallCloseIcon />}
        onClick={() => props.onClose(props.name)}
      />
    </>
  );
};

export default CustomTab;
