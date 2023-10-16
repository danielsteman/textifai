import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  useColorMode,
  GridItem,
  HStack,
  Heading,
  Spacer,
  IconButton,
  Box,
} from "@chakra-ui/react";
import theme from "../../app/themes/theme";
import { useDispatch, useSelector } from "react-redux";
import {
  closeChatSupport,
  closeMiniLibrary,
  closePdfViewer,
} from "../../features/Workspace/tabsSlice";
import { RootState } from "../../app/store";
import { sumBooleanAttributes } from "../utils/sumBooleanAttributes";

interface SupportWindowGridItemProps {
  children: React.ReactNode;
  windowName: string;
  tabName: string;
}

const SupportWindowGridItem: React.FC<SupportWindowGridItemProps> = ({
  children,
  windowName,
  tabName,
}) => {
  const { colorMode } = useColorMode();
  const dispatch = useDispatch();
  const openTabs = useSelector((state: RootState) => state.tabs.openTabs);
  const openSupportWindows =
    sumBooleanAttributes(openTabs as any, "openChatSupport") +
    sumBooleanAttributes(openTabs as any, "openMiniLibrary") +
    sumBooleanAttributes(openTabs as any, "openPdfViewer");
    const onClose = () => {
      switch (windowName) {
        case "Library": {
          dispatch(closeMiniLibrary(tabName));
          break;
        }
        case "Chat": {
          dispatch(closeChatSupport(tabName));
          break;
        }
        case "Pdf viewer": {
          dispatch(closePdfViewer(tabName));
          break;
        }
        default: {
          console.warn("Found unrecognized window name");
          break;
        }
      }
    };    
  return (
    <GridItem
      overflowY="scroll"
      display="flex"
      flexDir="column"
      rowSpan={3 - openSupportWindows}
      colSpan={1}
      bgColor={theme.colors[colorMode].surfaceContainer}
      h="100%"
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
      <Box overflowY="auto" h="100%">
        {children}
      </Box>
    </GridItem>
  );
};

export default SupportWindowGridItem;
