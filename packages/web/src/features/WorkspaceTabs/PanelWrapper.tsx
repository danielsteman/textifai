// PanelWrapper.tsx
import React, { Dispatch, SetStateAction } from "react";
import {
  Grid,
  GridItem,
  HStack,
  Heading,
  IconButton,
  Spacer,
  TabPanel,
  useColorMode,
} from "@chakra-ui/react";
import { ITab } from "../../app/routes/Workspace";
import MiniLibraryPanel from "./MiniLibraryPanel";
import ChatPanel from "./ChatPanel";
import PdfViewerPanel from "./PdfViewerPanel";
import theme from "../../app/themes/theme";
import { SmallCloseIcon } from "@chakra-ui/icons";

interface PanelWrapperProps {
  tab: ITab;
  onClose: (
    panelType: "openChatSupport" | "openMiniLibrary" | "openPdfViewer"
  ) => void;
}

interface SupportWindowGridItemProps {
  children: React.ReactNode;
  windowName: string;
  onClose: () => void;
}

const SupportWindowGridItem: React.FC<SupportWindowGridItemProps> = ({
  children,
  windowName,
  onClose,
}) => {
  const { colorMode } = useColorMode();
  return (
    <GridItem
      rowSpan={1}
      colSpan={1}
      h="100%"
      bgColor={theme.colors[colorMode].surfaceContainer}
      pb={2}
      borderRadius={8}
    >
      <HStack
        mb={2}
        pl={2}
        bgColor={theme.colors[colorMode].primaryContainer}
        borderTopRadius={8}
      >
        <Heading size="xs" color={theme.colors[colorMode].onPrimaryContainer}>
          {windowName}
        </Heading>
        <Spacer />
        <IconButton
          variant="ghost"
          size="xs"
          aria-label={"close"}
          icon={<SmallCloseIcon />}
          onClick={onClose}
        />
      </HStack>
      {children}
    </GridItem>
  );
};

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
