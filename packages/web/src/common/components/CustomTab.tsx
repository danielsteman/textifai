import { SmallCloseIcon } from "@chakra-ui/icons";
import { Tab, IconButton, Box, Flex } from "@chakra-ui/react";
import { ITab } from "../../app/layouts/WorkspaceLayout";

interface Props {
  name: string;
  onOpen: (tab: ITab) => void;
  onClose: (tab: ITab) => void;
}

const CustomTab: React.FC<Props> = (props) => {
  return (
    <Box flex={1} position={"relative"}>
      <Tab width="100%" _hover={{ background: "lightgrey" }}>
        {props.name}
      </Tab>
      <IconButton
        position={"absolute"}
        right={0.5}
        variant="ghost"
        borderRadius={20}
        top={0.5}
        size="xs"
        aria-label={"close"}
        icon={<SmallCloseIcon />}
        onClick={() => props.onClose(props.name)}
      />
    </Box>
  );
};

export default CustomTab;
