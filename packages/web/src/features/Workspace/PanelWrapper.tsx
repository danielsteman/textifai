import React from "react";
import { Grid, GridItem, TabPanel } from "@chakra-ui/react";
import { ITab } from "../../features/Workspace/Workspace";
import MiniLibraryPanel from "./panels/MiniLibraryPanel";
import ChatPanel from "./panels/ChatPanel";
import PdfViewerPanel from "./panels/PdfViewerPanel";
import SupportWindowGridItem from "../../common/components/SupportWindowGridItem";

// allow supportchat for pdf document tabs

interface PanelWrapperProps {
  tab: ITab;
  onClose: (
    panelType: "openChatSupport" | "openMiniLibrary" | "openPdfViewer"
  ) => void;
}

const PanelWrapper: React.FC<PanelWrapperProps> = ({ tab, onClose }) => {
  return (
    <TabPanel h="100%" flex="1" borderRadius={16} p={2}>
      <Grid
        h="100%"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap={2}
      >
        <GridItem
          rowSpan={2}
          colSpan={
            tab.openChatSupport || tab.openMiniLibrary || tab.openPdfViewer
              ? 2
              : 3
          }
        >
          {tab.panel}
        </GridItem>
        {tab.openMiniLibrary && (
          <SupportWindowGridItem
            onClose={() => onClose("openMiniLibrary")}
            windowName="Library"
          >
            <MiniLibraryPanel />
          </SupportWindowGridItem>
        )}

        {tab.openChatSupport && (
          <SupportWindowGridItem
            onClose={() => onClose("openChatSupport")}
            windowName="Chat"
          >
            <ChatPanel />
          </SupportWindowGridItem>
        )}

        {tab.openPdfViewer && (
          <SupportWindowGridItem
            onClose={() => onClose("openPdfViewer")}
            windowName="Pdf viewer"
          >
            <PdfViewerPanel />
          </SupportWindowGridItem>
        )}
      </Grid>
    </TabPanel>
  );
};

export default PanelWrapper;
