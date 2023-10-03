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
          <SupportWindowGridItem
            onClose={() => dispatch(closeMiniLibrary("Library"))}
            windowName="Library"
          >
            <Box overflowY="auto" h="100%">
              <MiniLibraryPanel />
            </Box>
          </SupportWindowGridItem>
        )}

        {tab.openChatSupport && (
          <SupportWindowGridItem
            onClose={() => dispatch(closeChatSupport("Chat"))}
            windowName="Chat"
          >
            <Box overflowY="auto" h="100%">
              <ChatPanel />
            </Box>
          </SupportWindowGridItem>
        )}

        {tab.openPdfViewer && (
          <SupportWindowGridItem
            onClose={() => dispatch(closePdfViewer("Pdf viewer"))}
            windowName="Pdf viewer"
          >
            <Box overflowY="auto" h="100%">
              <PdfViewerPanel />
            </Box>
          </SupportWindowGridItem>
        )}
      </Grid>
    </TabPanel>
  );
};

export default PanelWrapper;
