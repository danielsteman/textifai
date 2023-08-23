import { SettingsIcon } from "@chakra-ui/icons";
import {
  ButtonGroup,
  IconButton,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

const Workspace = () => {
  return (
    <>
      <ButtonGroup>
        <IconButton aria-label={"settings"} icon={<SettingsIcon />} />
      </ButtonGroup>
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab>One</Tab>
          <Tab>Two</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <p>one!</p>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </>
  );
};

export default Workspace;
