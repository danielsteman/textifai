import { Tabs, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import { useOutletContext } from "react-router-dom";
import { ContextType, ITab } from "../layouts/WorkspaceLayout";
import CustomTab from "../../common/components/CustomTab";
import {
  addItemIfNotExist,
  removeItemIfExists,
} from "../../common/utils/arrayManager";

const Workspace = () => {
  const { openTabs, setOpenTabs } = useOutletContext<ContextType>();

  const onClose = (tab: ITab) => {
    setOpenTabs(removeItemIfExists(openTabs, tab));
  };

  const onOpen = (tab: ITab) => {
    setOpenTabs(addItemIfNotExist(openTabs, tab));
  };

  // TODO: add logic that focuses a tab when another one is closed etc.

  return (
    <Tabs variant="soft-rounded" size="sm">
      <TabList mb="1em">
        {openTabs.map((tab) => (
          <CustomTab
            key={tab.name}
            tab={tab}
            onOpen={onOpen}
            onClose={onClose}
          />
        ))}
      </TabList>
      <TabPanels>
        {openTabs.map((tab) => (
          <TabPanel key={tab.name}>{tab.panel}</TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default Workspace;
