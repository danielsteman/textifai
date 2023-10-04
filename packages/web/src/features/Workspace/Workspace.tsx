import {
  ChatIcon,
  SmallCloseIcon,
  HamburgerIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Tab,
  TabList,
  TabPanels,
  Tabs,
  Tooltip,
  VStack,
  useColorMode,
  Divider,
  MenuItem,
  Menu,
  MenuList,
  MenuButton,
  MenuGroup,
} from "@chakra-ui/react";
import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import ColorModeSwitcher from "../../common/components/ColorModeSwitcher";
import UserCard from "../../common/components/UserCard";
import EditorPanel from "../../features/Workspace/panels/EditorPanel";
import {
  FaBook,
  FaBookOpen,
  FaEdit,
  FaFilePdf,
  FaRegFilePdf,
} from "react-icons/fa";
import ChatPanel from "./panels/ChatPanel";
import PanelWrapper from "../../features/Workspace/PanelWrapper";
import MegaLibraryPanel from "./panels/MegaLibraryPanel";
import theme from "../../app/themes/theme";
import PdfViewerPanel from "./panels/PdfViewerPanel";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { ProjectContext } from "../../app/providers/ProjectProvider";
import { getCurrentProjectTitle } from "../../common/utils/getCurrentProjectTitle";
import {
  activateTab,
  closeTab,
  openChatSupport,
  openMiniLibrary,
  openPdfViewer,
  openTab,
} from "./tabsSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";

export type ITab = {
  name: string;
  panel: ReactNode;
  openChatSupport: boolean;
  openMiniLibrary: boolean;
  openPdfViewer: boolean;
  isActive?: boolean;
};

const Workspace = () => {
  const { colorMode } = useColorMode();
  const [isMenuOpen, setIsMenuOpen] = useState(true);

  const userProjects = useContext(ProjectContext);

  const dispatch = useDispatch();
  const openTabs = useSelector((state: RootState) => state.tabs.openTabs);
  const activeTabIndex = useSelector(
    (state: RootState) => state.tabs.activeTabIndex
  );

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const defaultTab: ITab = {
      name: "Library",
      panel: <MegaLibraryPanel />,
      openChatSupport: false,
      openMiniLibrary: false,
      openPdfViewer: false,
    };
    dispatch(openTab(defaultTab));
  }, []);

  return (
    <HStack h="100%">
      {isMenuOpen && (
        <VStack
          bgColor={theme.colors[colorMode].surfaceContainer}
          h="100%"
          p={2}
        >
          <Flex justifyContent="flex-end" w="100%">
            <IconButton
              aria-label="Close Menu"
              icon={<MdKeyboardDoubleArrowLeft />}
              onClick={toggleMenu}
              size="sm"
            />
          </Flex>
          <Menu>
            <MenuButton
              textAlign="left"
              mb={2}
              w="100%"
              as={Button}
              size="sm"
              variant="ghost"
              rightIcon={<ChevronDownIcon />}
            >
              {getCurrentProjectTitle(userProjects)}
            </MenuButton>
            <MenuList>
              <MenuGroup title="All projects">
                {userProjects.map((project) => (
                  <MenuItem key={project.name}>{project.name}</MenuItem>
                ))}
              </MenuGroup>
            </MenuList>
          </Menu>
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
              dispatch(openTab(tab));
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
              dispatch(openTab(tab));
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
                panel: <MegaLibraryPanel />,
                openChatSupport: false,
                openMiniLibrary: false,
                openPdfViewer: false,
              };
              dispatch(openTab(tab));
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
              dispatch(openTab(tab));
            }}
          >
            Pdf Viewer
          </Button>
          <Spacer />
          <Divider />
          <UserCard />
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
              const tab = {
                name: "Editor",
                panel: <EditorPanel />,
                openChatSupport: false,
                openMiniLibrary: false,
                openPdfViewer: false,
              };
              dispatch(openTab(tab));
            }}
          />
          <IconButton
            aria-label={"Chat"}
            icon={<ChatIcon />}
            onClick={() => {
              const tab: ITab = {
                name: "Chat",
                panel: <ChatPanel />,
                openChatSupport: false,
                openMiniLibrary: false,
                openPdfViewer: false,
              };
              dispatch(openTab(tab));
            }}
          />
          <IconButton
            aria-label={"Library"}
            icon={<FaBook />}
            onClick={() => {
              const tab: ITab = {
                name: "Library",
                panel: <MegaLibraryPanel />,
                openChatSupport: false,
                openMiniLibrary: false,
                openPdfViewer: false,
              };
              dispatch(openTab(tab));
            }}
          />
          <IconButton
            aria-label={"Pdf Viewer"}
            icon={<FaFilePdf />}
            onClick={() => {
              const tab: ITab = {
                name: "PdfViewer",
                panel: <PdfViewerPanel />,
                openChatSupport: false,
                openMiniLibrary: false,
                openPdfViewer: false,
              };
              dispatch(openTab(tab));
            }}
          />
          <Spacer />
          <ColorModeSwitcher />
        </VStack>
      )}
      {openTabs && openTabs.length > 0 && (
        <Tabs
          index={activeTabIndex}
          onChange={(index) => dispatch(activateTab(openTabs[index - 1]))}
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
                  tab.name === openTabs[activeTabIndex].name
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
                      onClick={() => dispatch(activateTab(tab))}
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
                        dispatch(closeTab(tab));
                      }}
                    />
                  </Box>
                );
              })}
            </TabList>
            <Spacer />
            {openTabs[activeTabIndex].name === "Editor" && (
              <>
                <Tooltip label="Open mini library">
                  <IconButton
                    aria-label={"library-support"}
                    icon={<FaBookOpen />}
                    onClick={() => {
                      dispatch(openMiniLibrary("Editor"));
                    }}
                  />
                </Tooltip>
                <Box w={2} />
                <Tooltip label="Open support chat">
                  <IconButton
                    aria-label={"chat-support"}
                    icon={<ChatIcon />}
                    onClick={() => {
                      dispatch(openChatSupport("Editor"));
                    }}
                  />
                </Tooltip>
                <Box w={2} />
                <Tooltip label="Open PDF Viewer">
                  <IconButton
                    aria-label={"pdf-viewer"}
                    icon={<FaRegFilePdf />}
                    onClick={() => {
                      dispatch(openPdfViewer("Editor"));
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
              <PanelWrapper key={tab.name} tab={tab} />
            ))}
          </TabPanels>
        </Tabs>
      )}
    </HStack>
  );
};

export default Workspace;
