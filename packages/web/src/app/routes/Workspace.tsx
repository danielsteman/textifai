import { ChatIcon, SmallCloseIcon, UpDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Tooltip,
  VStack,
  useColorMode,
  Divider
} from "@chakra-ui/react";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import ColorModeSwitcher from "../../common/components/ColorModeSwitcher";
import UserCard from "../../common/components/UserCard";
import EditorPanel from "../../features/WorkspaceTabs/EditorPanel";
import {
  FaBook,
  FaBookOpen,
  FaEdit,
  FaFilePdf,
  FaRegFilePdf,
} from "react-icons/fa";
import { addItemIfNotExist } from "../../common/utils/arrayManager";
import ChatPanel from "../../features/WorkspaceTabs/ChatPanel";
import PanelWrapper from "../../features/WorkspaceTabs/PanelWrapper";
import MegaLibraryPanel from "../../features/WorkspaceTabs/MegaLibraryPanel";
import theme from "../themes/theme";
import { AuthContext } from "../providers/AuthProvider";
import { auth, storage } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import PdfViewerPanel from "../../features/WorkspaceTabs/PdfViewerPanel";
import SinglePdfViewer from "../../features/PdfViewer/PdfViewer";
import { ref } from "firebase/storage";

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
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const navigate = useNavigate();
  const currentUser = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onTabClose = (tabToClose: ITab) => {
    const newTabs = openTabs.filter((tab) => tab.name !== tabToClose.name);
    setOpenTabs(newTabs);

    if (tabToClose.name === currentTab?.name) {
      setCurrentTab(newTabs[newTabs.length - 1] || defaultTab);
    }
  };

  const closeSupportingPanel = (
    panelType: "openChatSupport" | "openMiniLibrary" | "openPdfViewer"
  ) => {
    const updatedOpenTabs = openTabs.map((tab) =>
      tab.name === currentTab?.name ? { ...tab, [panelType]: false } : tab
    );
    setOpenTabs(updatedOpenTabs);
  };

  const defaultTab: ITab = {
    name: "Editor",
    panel: <EditorPanel />,
    openChatSupport: false,
    openMiniLibrary: false,
    openPdfViewer: false,
  };

  useEffect(() => {
    setOpenTabs(addItemIfNotExist(openTabs, defaultTab, "name"));
    setCurrentTab(defaultTab);
  }, []);

  useEffect(() => {
    setActiveTabIndex(openTabs.length - 1);
  }, [openTabs]);

  return (
    <HStack h="100%">
    {/* Side Menu */}
    {isMenuOpen && (
      <VStack bgColor={theme.colors[colorMode].surfaceContainer} h="100%" p={2}>
        {/* Close button */}
        <Flex justifyContent="flex-end" w="100%">
          <IconButton
            aria-label="Close Menu"
            icon={<SmallCloseIcon />}
            onClick={toggleMenu}
            mb={2}
          />
        </Flex>
        {/* User Card Component */}
        <UserCard 
            onLogout={() => {
                auth.signOut();
                navigate("/");
            }} 
        />
        {/* Divider */}
        <Divider />
        <Button
          w="100%"
          justifyContent="flex-start"
          aria-label={"editor"}
          leftIcon={<FaEdit />}
          variant="ghost"
          size="sm"
          onClick={() => {
            const tab = {
              name: "Editor",
              panel: <EditorPanel />,
              openChatSupport: false,
              openMiniLibrary: false,
              openPdfViewer: false,
            };
            setOpenTabs(addItemIfNotExist(openTabs, tab, "name"));
            setCurrentTab(tab);
          }}
        >
          Editor
        </Button>
        <Button
          w="100%"
          justifyContent="flex-start"
          aria-label={"chat"}
          leftIcon={<ChatIcon />}
          variant="ghost"
          size="sm"
          onClick={() => {
            const tab: ITab = {
              name: "Chat",
              panel: <ChatPanel />,
              openChatSupport: false,
              openMiniLibrary: false,
              openPdfViewer: false,
            };
            setOpenTabs(addItemIfNotExist(openTabs, tab, "name"));
            setCurrentTab(tab);
          }}
        >
          Chat
        </Button>
        <Button
          w="100%"
          justifyContent="flex-start"
          aria-label={"documents"}
          leftIcon={<FaBook />}
          variant="ghost"
          size="sm"
          onClick={() => {
            const tab: ITab = {
              name: "Library",
              panel: (
                <MegaLibraryPanel
                  openTabs={openTabs}
                  setOpenTabs={setOpenTabs}
                  setCurrentTab={setCurrentTab}
                />
              ),
              openChatSupport: false,
              openMiniLibrary: false,
              openPdfViewer: false,
            };
            setOpenTabs(addItemIfNotExist(openTabs, tab, "name"));
            setCurrentTab(tab);
          }}
        >
          Library
        </Button>
        <Button
          w="100%"
          justifyContent="flex-start"
          aria-label={"documents"}
          leftIcon={<FaFilePdf />}
          variant="ghost"
          size="sm"
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
          }}
        >
          Pdf Viewer
        </Button>
        <Spacer />
        {/* <HStack p={1} gap={3}>
          <Avatar size="sm" />
          <Box fontSize={14}>{currentUser?.email}</Box>
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<UpDownIcon />}
              size="sm"
              variant="ghost"
            />
            <MenuList>
              <MenuItem
                onClick={() => {
                  auth.signOut();
                  navigate("/");
                }}
              >
                Sign out
              </MenuItem>
              <ColorModeSwitcher />
            </MenuList>
          </Menu>
        </HStack> */}
      </VStack>
    )}
    {!isMenuOpen && (
      <VStack
        bgColor={theme.colors[colorMode].surfaceContainer}
        w="3.5rem"
        h="100%"
        justifyContent="start"
        alignItems="center"
        spacing={4}
        pb={3}
        pt={3}
      >
        <IconButton
          aria-label="Open Menu"
          icon={<HamburgerIcon />}
          onClick={toggleMenu}
        />
        <IconButton
          aria-label={"Editor"}
          icon={<FaEdit />}
          onClick={() => {
            //... onClick logic for Editor button...
          }}
        />
        <IconButton
          aria-label={"Chat"}
          icon={<ChatIcon />}
          onClick={() => {
            //... onClick logic for Chat button...
          }}
        />
        <IconButton
          aria-label={"Library"}
          icon={<FaBook />}
          onClick={() => {
            //... onClick logic for Library button...
          }}
        />
        <IconButton
          aria-label={"Pdf Viewer"}
          icon={<FaFilePdf />}
          onClick={() => {
            //... onClick logic for Pdf Viewer button...
          }}
        />
        <Spacer />
        <ColorModeSwitcher />
      </VStack>
    )}
      <Tabs
        index={activeTabIndex}
        onChange={setActiveTabIndex}
        w="100%"
        h="100%"
        maxH="100%"
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
                  <Tab
                    px={12}
                    onClick={() => setCurrentTab(tab)}
                    whiteSpace="nowrap"
                  >
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
        </Flex>
        <TabPanels
          flex="1"
          display="flex"
          flexDirection="column"
          px={2}
          pb={2}
          maxH="calc(100% - 58px)"
        >
          {openTabs.map((tab) => (
            <PanelWrapper
              onClose={closeSupportingPanel}
              tab={tab}
              key={tab.name}
            />
          ))}
        </TabPanels>
      </Tabs>
    </HStack>
  );
};

export default Workspace;