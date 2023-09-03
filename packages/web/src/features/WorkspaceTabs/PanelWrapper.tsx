import { Grid, GridItem, TabPanel } from "@chakra-ui/react";
import { ITab } from "../../app/routes/Workspace";
import MiniLibraryPanel from "./MiniLibraryPanel";
import ChatPanel from "./ChatPanel";

interface Props {
  tab: ITab;
}

const PanelWrapper: React.FC<Props> = (props) => {
  return (
    <TabPanel h="100%" flex="1" bgColor={"black"} borderRadius={16} p={2}>
      <Grid
        h="100%"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap={2}
      >
        <GridItem
          rowSpan={2}
          colSpan={
            props.tab.openChatSupport || props.tab.openMiniLibrary ? 2 : 3
          }
        >
          {props.tab.panel}
        </GridItem>
        {props.tab.openMiniLibrary && (
          <GridItem rowSpan={1} colSpan={1} h="100%">
            <MiniLibraryPanel />
          </GridItem>
        )}
        {props.tab.openChatSupport && (
          <GridItem rowSpan={1} colSpan={1} h="100%">
            <ChatPanel />
          </GridItem>
        )}
      </Grid>
    </TabPanel>
  );
};

export default PanelWrapper;
