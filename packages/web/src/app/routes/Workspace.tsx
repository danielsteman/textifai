import { ChatIcon, HamburgerIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Spacer,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Tooltip,
  VStack,
  useColorMode,
  useDisclosure,
} from "@chakra-ui/react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import ColorModeSwitcher from "../../common/components/ColorModeSwitcher";
import EditorPanel from "../../features/WorkspaceTabs/EditorPanel";
import { FaBook, FaBookOpen, FaEdit, FaFilePdf, FaRegFilePdf } from "react-icons/fa";
import {
  addItemIfNotExist,
  removeItemIfExists,
} from "../../common/utils/arrayManager";
import ChatPanel from "../../features/WorkspaceTabs/ChatPanel";
import PdfViewerPanel from "../../features/WorkspaceTabs/PdfViewerPanel";
import PanelWrapper from "../../features/WorkspaceTabs/PanelWrapper";
import MegaLibraryPanel from "../../features/WorkspaceTabs/MegaLibraryPanel";
import theme from "../themes/theme";

export type ITab = {
  name: string;
  panel: ReactNode;
  openChatSupport: boolean;
  openMiniLibrary: boolean;
  openPdfViewer: boolean;
};

export type OpenTabsContext = {
  openTabs: ITab[];
  setOpenTabs: Dispatch<SetStateAction<ITab[]>>;
};

const Workspace = () => {
  const { colorMode } = useColorMode();
  const [openTabs, setOpenTabs] = useState<ITab[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState<ITab>();

  const onTabClose = (tab: ITab) => {
    setOpenTabs(removeItemIfExists(openTabs, tab));
    setCurrentTab(openTabs[openTabs.length - 2]);
  };

  const defaultTab: ITab = {
    name: "Editor",
    panel: <EditorPanel />,
    openChatSupport: false,
    openMiniLibrary: false,
    openPdfViewer: false
  };

  useEffect(() => {
    setOpenTabs(addItemIfNotExist(openTabs, defaultTab, "name"));
    setCurrentTab(defaultTab);
  }, []);

  useEffect(() => {
    setActiveTabIndex(openTabs.length - 1);
  }, [openTabs]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Tabs
      index={activeTabIndex}
      onChange={setActiveTabIndex}
      h="100%"
      variant="unstyled"
      size="md"
      display="flex"
      flexDirection="column"
    >
      <Flex direction="row" p={2}>
        <TabList>
          {openTabs.map((tab) => {
            const activeProps =
              tab.name === currentTab?.name
                ? {
                    borderBottom: "2px",
                    borderColor: theme.colors[colorMode].primary,
                  }
                : {};
            return (
              <Box
                key={tab.name}
                flex={1}
                position={"relative"}
                {...activeProps}
              >
                <Tab px={12} onClick={() => setCurrentTab(tab)}>
                  {tab.name}
                </Tab>
                <IconButton
                  position={"absolute"}
                  right={0.5}
                  variant="ghost"
                  borderRadius={16}
                  top={1.5}
                  size="xs"
                  aria-label={"close"}
                  icon={<SmallCloseIcon />}
                  onClick={() => {
                    onTabClose(tab);
                  }}
                />
              </Box>
            );
          })}
        </TabList>
        <Spacer />
        {currentTab?.name === "Editor" && (
          <>
            <Tooltip label="Open mini library">
              <IconButton
                aria-label={"library-support"}
                icon={<FaBookOpen />}
                onClick={() => {
                  const updatedOpenTabs = openTabs.map((tab) =>
                    tab.name == currentTab?.name
                      ? { ...tab, openMiniLibrary: true }
                      : tab
                  );
                  setOpenTabs(updatedOpenTabs);
                }}
              />
            </Tooltip>
            <Box w={2} />
            <Tooltip label="Open support chat">
              <IconButton
                aria-label={"chat-support"}
                icon={<ChatIcon />}
                onClick={() => {
                  const updatedOpenTabs = openTabs.map((tab) =>
                    tab.name == currentTab?.name
                      ? { ...tab, openChatSupport: true }
                      : tab
                  );
                  setOpenTabs(updatedOpenTabs);
                }}
              />
            </Tooltip>
            <Box w={2} />
            <Tooltip label="Open PDF Viewer">
              <IconButton
                aria-label={"pdf-viewer"}
                icon={<FaRegFilePdf />} 
                onClick={() => {
                  const updatedOpenTabs = openTabs.map((tab) =>
                    tab.name === currentTab?.name
                      ? { ...tab, openPdfViewer: true }
                      : tab
                  );
                  setOpenTabs(updatedOpenTabs);
                }}
              />
            </Tooltip>
            <Box w={2} />
          </>
        )}
        <IconButton
          aria-label={"settings"}
          icon={<HamburgerIcon />}
          onClick={onOpen}
        />
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Workspace settings</DrawerHeader>
            <DrawerBody>
              <VStack>
                <Button
                  w="100%"
                  justifyContent="flex-start"
                  aria-label={"editor"}
                  leftIcon={<FaEdit />}
                  onClick={() => {
                    const tab = {
                      name: "Editor",
                      panel: <EditorPanel />,
                      openChatSupport: false,
                      openMiniLibrary: false,
                      openPdfViewer: false
                    };
                    setOpenTabs(addItemIfNotExist(openTabs, tab, "name"));
                    setCurrentTab(tab);
                    onClose();
                  }}
                >
                  Editor
                </Button>
                <Button
                  w="100%"
                  justifyContent="flex-start"
                  aria-label={"chat"}
                  leftIcon={<ChatIcon />}
                  onClick={() => {
                    const tab: ITab = {
                      name: "Chat",
                      panel: <ChatPanel />,
                      openChatSupport: false,
                      openMiniLibrary: false,
                      openPdfViewer: false
                    };
                    setOpenTabs(addItemIfNotExist(openTabs, tab, "name"));
                    setCurrentTab(tab);
                    onClose();
                  }}
                >
                  Chat
                </Button>
                <Button
                  w="100%"
                  justifyContent="flex-start"
                  aria-label={"documents"}
                  leftIcon={<FaBook />}
                  onClick={() => {
                    const tab: ITab = {
                      name: "Library",
                      panel: <MegaLibraryPanel />,
                      openChatSupport: false,
                      openMiniLibrary: false,
                      openPdfViewer: false
                    };
                    setOpenTabs(addItemIfNotExist(openTabs, tab, "name"));
                    setCurrentTab(tab);
                    onClose();
                  }}
                >
                  Library
                </Button>
                <Button
                  w="100%"
                  justifyContent="flex-start"
                  aria-label={"pdf-viewer"}
                  leftIcon={<FaFilePdf />} 
                  onClick={() => {
                    const tab: ITab = {
                      name: "PdfViewer",
                      panel: <PdfViewerPanel />, 
                      openChatSupport: false,
                      openMiniLibrary: false,
                      openPdfViewer: false,
                    };
                    setOpenTabs(addItemIfNotExist(openTabs, tab, "name"));
                    setCurrentTab(tab);
                    onClose();
                  }}
                >
                  PdfViewer
                </Button>
              </VStack>
            </DrawerBody>
            <DrawerFooter>
              <ColorModeSwitcher />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Flex>
      <TabPanels flex="1" display="flex" flexDirection="column" px={2} pb={2}>
        {openTabs.map((tab) => (
          <PanelWrapper tab={tab} key={tab.name} />
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default Workspace;
