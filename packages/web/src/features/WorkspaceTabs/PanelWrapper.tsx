// PanelWrapper.tsx
import React from "react";
import {
  Grid,
  GridItem,
  IconButton,
  TabPanel,
  useColorMode,
} from "@chakra-ui/react";
import { ITab } from "../../app/routes/Workspace";
import MiniLibraryPanel from "./MiniLibraryPanel";
import ChatPanel from "./ChatPanel";
import PdfViewerPanel from "./PdfViewerPanel";
import theme from "../../app/themes/theme";
import { SmallCloseIcon } from "@chakra-ui/icons";

interface Props {
  tab: ITab;
  onClose: (
    panelType: "openChatSupport" | "openMiniLibrary" | "openPdfViewer"
  ) => void;
}

const PanelWrapper: React.FC<Props> = ({ tab, onClose }) => {
  const { colorMode } = useColorMode();

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
          <GridItem rowSpan={1} colSpan={1} h="100%" position="relative">
            <MiniLibraryPanel />
            <IconButton
              position={"absolute"}
              right={2}
              top={2}
              variant="ghost"
              size="sm"
              aria-label={"close"}
              icon={<SmallCloseIcon />}
              onClick={() => onClose("openMiniLibrary")}
            />
          </GridItem>
        )}

        {tab.openChatSupport && (
          <GridItem rowSpan={1} colSpan={1} h="100%" position="relative">
            <ChatPanel />
            <IconButton
              position={"absolute"}
              right={2}
              top={2}
              variant="ghost"
              size="sm"
              aria-label={"close"}
              icon={<SmallCloseIcon />}
              onClick={() => onClose("openChatSupport")}
            />
          </GridItem>
        )}

        {tab.openPdfViewer && (
          <GridItem rowSpan={1} colSpan={1} h="100%" position="relative">
            <PdfViewerPanel />
            <IconButton
              position={"absolute"}
              right={2}
              top={2}
              variant="ghost"
              size="sm"
              aria-label={"close"}
              icon={<SmallCloseIcon />}
              onClick={() => onClose("openPdfViewer")}
            />
          </GridItem>
        )}
      </Grid>
    </TabPanel>
  );
};

export default PanelWrapper;
