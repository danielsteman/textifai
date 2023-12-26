import React from "react";
import { Grid, GridItem, TabPanel, Box, VStack } from "@chakra-ui/react";
import { ITab } from "../../features/Workspace/Workspace";
import MiniLibraryPanel from "./panels/MiniLibraryPanel";
import ChatPanel from "./panels/ChatPanel";
import PdfViewerPanel from "./panels/PdfViewerPanel";
import SupportWindowGridItem from "../../common/components/SupportWindowGridItem";

interface PanelWrapperProps {
  tab: ITab;
  isActiveTab: boolean;
}

const PanelWrapper: React.FC<PanelWrapperProps> = ({ tab, isActiveTab }) => {
  const isAnySupportPanelOpen =
    tab.openChatSupport || tab.openMiniLibrary || tab.openPdfViewer;

  // console.log(`${tab.name} as active tab: ${isActiveTab}`);
  // console.log(`Is any support panel open: ${isAnySupportPanelOpen}`);

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
          colSpan={isActiveTab && isAnySupportPanelOpen ? 2 : 3}
        >
          <Box overflowY="auto" h="100%">
            {tab.panel}
          </Box>
        </GridItem>

        {isActiveTab && isAnySupportPanelOpen && (
          <GridItem rowSpan={2} colSpan={1}>
            <VStack h="100%">
              {tab.openMiniLibrary && (
                <SupportWindowGridItem windowName="Library" tabName={tab.name}>
                  <MiniLibraryPanel />
                </SupportWindowGridItem>
              )}

              {tab.openChatSupport && (
                <SupportWindowGridItem windowName="Chat" tabName={tab.name}>
                  <ChatPanel />
                </SupportWindowGridItem>
              )}

              {tab.openPdfViewer && (
                <SupportWindowGridItem
                  windowName="Pdf viewer"
                  tabName={tab.name}
                >
                  <PdfViewerPanel />
                </SupportWindowGridItem>
              )}
            </VStack>
          </GridItem>
        )}
      </Grid>
    </TabPanel>
  );
};

export default PanelWrapper;
