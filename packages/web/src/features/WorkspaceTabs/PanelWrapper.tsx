import React from "react";
import { Grid, GridItem, TabPanel } from "@chakra-ui/react";
import { ITab } from "../../app/routes/Workspace";
import MiniLibraryPanel from "./MiniLibraryPanel";
import ChatPanel from "./ChatPanel";
import PdfViewerPanel from "./PdfViewerPanel";
import SupportWindowGridItem from "../../common/components/SupportWindowGridItem";

interface PanelWrapperProps {
  tab: ITab;
  selectedDocuments: string[];
  onClose: (
    panelType: "openChatSupport" | "openMiniLibrary" | "openPdfViewer"
  ) => void;
}

const PanelWrapper: React.FC<PanelWrapperProps> = ({
  tab,
  selectedDocuments,
  onClose,
}) => {
  console.log(tab);
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
            <ChatPanel selectedDocuments={selectedDocuments} />
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
