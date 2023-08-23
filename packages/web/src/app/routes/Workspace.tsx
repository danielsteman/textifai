import { Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import { ContextType } from "../layouts/WorkspaceLayout";
import CustomTab from "../../common/components/CustomTab";
import {
  addItemIfNotExist,
  removeItemIfExists,
} from "../../common/utils/arrayManager";

const Workspace = () => {
  const { openTabs, setOpenTabs } = useOutletContext<ContextType>();

  const onClose = (tab: string) => {
    setOpenTabs(removeItemIfExists(openTabs, tab));
  };

  const onOpen = (tab: string) => {
    setOpenTabs(addItemIfNotExist(openTabs, tab));
  };

  // TODO: add logic that focuses a tab when another one is closed etc.
  // TODO: make tabpanels dynamic. probably change ContextType to a more complex type containing child components

  return (
    <Tabs isFitted variant="soft-rounded" size="md">
      <TabList mb="1em">
        {openTabs.map((tab) => (
          <CustomTab key={tab} name={tab} onOpen={onOpen} onClose={onClose} />
        ))}
      </TabList>
      <TabPanels>
        <TabPanel>
          <p>Paste editor here...</p>
        </TabPanel>
        <TabPanel>
          <p>Paste document collection here...</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default Workspace;
