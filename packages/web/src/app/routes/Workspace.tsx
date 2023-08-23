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
import CustomTab from "../../common/components/CustomTab";

const Workspace = () => {
  const { openTabs, setOpenTabs } = useOutletContext<ContextType>();

  const onClose = (tab: string) => {
    setOpenTabs(removeItemIfExists(openTabs, tab));
  };

  const onOpen = (tab: string) => {
    setOpenTabs(addItemIfNotExist(openTabs, tab));
  };

  return (
    <Tabs isFitted variant="enclosed" size="md">
      <TabList mb="1em">
        {openTabs.map((tab) => (
          <CustomTab name={tab} onOpen={onOpen} onClose={onClose} />
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
