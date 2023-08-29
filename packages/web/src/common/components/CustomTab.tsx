import { SmallCloseIcon } from "@chakra-ui/icons";
import { Tab, IconButton, Box } from "@chakra-ui/react";
import { ITab } from "../../app/routes/Workspace";

interface Props {
  tab: ITab;
  onClose: (tab: ITab) => void;
}

const CustomTab: React.FC<Props> = (props) => {
  return (
    <Box flex={1} position={"relative"}>
      <Tab _hover={{ background: "lightgrey" }} px={12}>
        {props.tab.name}
      </Tab>
      <IconButton
        position={"absolute"}
        right={0.5}
        variant="ghost"
        borderRadius={16}
        top={0.5}
        size="xs"
        aria-label={"close"}
        icon={<SmallCloseIcon />}
        onClick={() => props.onClose(props.tab)}
      />
    </Box>
  );
};

export default CustomTab;
