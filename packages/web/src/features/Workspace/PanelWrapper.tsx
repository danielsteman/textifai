import React from "react";
import { Grid, GridItem, TabPanel, Box } from "@chakra-ui/react";
import { ITab } from "../../features/Workspace/Workspace";
import MiniLibraryPanel from "./panels/MiniLibraryPanel";
import ChatPanel from "./panels/ChatPanel";
import PdfViewerPanel from "./panels/PdfViewerPanel";
import SupportWindowGridItem from "../../common/components/SupportWindowGridItem";
import { useDispatch } from "react-redux";
import {
  closeChatSupport,
  closeMiniLibrary,
  closePdfViewer,
} from "./tabsSlice";

interface PanelWrapperProps {
  tab: ITab;
}

const PanelWrapper: React.FC<PanelWrapperProps> = ({ tab }) => {
  const dispatch = useDispatch();
  return (
    <TabPanel h="100%" flex="1" borderRadius={16} px={0} py={0}>
      <Grid
        h="100%"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap={2}
      >
        <GridItem
          overflowY="hidden"
          rowSpan={2}
          colSpan={
            tab.openChatSupport || tab.openMiniLibrary || tab.openPdfViewer
              ? 2
              : 3
          }
        >
          <Box overflowY="auto" h="100%">
            {tab.panel}
          </Box>
        </GridItem>

        {tab.openMiniLibrary && (
          <SupportWindowGridItem windowName="Library">
            <MiniLibraryPanel />
          </SupportWindowGridItem>
        )}

        {tab.openChatSupport && (
          <SupportWindowGridItem windowName="Chat">
            <ChatPanel />
          </SupportWindowGridItem>
        )}

        {tab.openPdfViewer && (
          <SupportWindowGridItem windowName="Pdf viewer">
            <PdfViewerPanel />
          </SupportWindowGridItem>
        )}
      </Grid>
    </TabPanel>
  );
};

export default PanelWrapper;
