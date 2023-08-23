import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  CloseButton,
  IconButton,
} from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import { ContextType } from "../layouts/WorkspaceLayout";
import { SmallCloseIcon } from "@chakra-ui/icons";

const Workspace = () => {
  const { openTabs, setOpenTabs } = useOutletContext<ContextType>();
  return (
    <Tabs isFitted variant="enclosed" size="md">
      <TabList mb="1em">
        <Tab position="relative">
          Editor
          <IconButton
            variant="ghost"
            position="absolute"
            right={2}
            size="xs"
            aria-label={"close"}
            icon={<SmallCloseIcon />}
          />
        </Tab>
        {openTabs.map((tab) => (
          <Tab>{tab}</Tab>
        ))}
      </TabList>
      <TabPanels>
        <TabPanel>
          <p>Paste editor here...</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Workspace;
