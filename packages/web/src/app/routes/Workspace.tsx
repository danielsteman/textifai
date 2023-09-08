import { ChatIcon, SmallCloseIcon, UpDownIcon } from "@chakra-ui/icons";
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
import EditorPanel from "../../features/WorkspaceTabs/EditorPanel";
import { FaBook, FaBookOpen, FaEdit } from "react-icons/fa";
import {
  addItemIfNotExist,
  removeItemIfExists,
} from "../../common/utils/arrayManager";
import ChatPanel from "../../features/WorkspaceTabs/ChatPanel";
import PanelWrapper from "../../features/WorkspaceTabs/PanelWrapper";
import MegaLibraryPanel from "../../features/WorkspaceTabs/MegaLibraryPanel";
import theme from "../themes/theme";
import { AuthContext } from "../providers/AuthProvider";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

export type ITab = {
  name: string;
  panel: ReactNode;
  openChatSupport: boolean;
  openMiniLibrary: boolean;
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

  const navigate = useNavigate();
  const currentUser = useContext(AuthContext);

  const onTabClose = (tab: ITab) => {
    setOpenTabs(removeItemIfExists(openTabs, tab));
    setCurrentTab(openTabs[openTabs.length - 2]);
  };

  const defaultTab: ITab = {
    name: "Editor",
    panel: <EditorPanel />,
    openChatSupport: false,
    openMiniLibrary: false,
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
      <VStack bgColor={theme.colors[colorMode].surfaceContainer} h="100%" p={2}>
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
              panel: <MegaLibraryPanel />,
              openChatSupport: false,
              openMiniLibrary: false,
            };
            setOpenTabs(addItemIfNotExist(openTabs, tab, "name"));
            setCurrentTab(tab);
          }}
        >
          Library
        </Button>
        <Spacer />
        <HStack p={1} gap={3}>
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
        </HStack>
      </VStack>
      <Tabs
        index={activeTabIndex}
        onChange={setActiveTabIndex}
        h="100%"
        w="100%"
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
            </>
          )}
        </Flex>
        <TabPanels flex="1" display="flex" flexDirection="column" px={2} pb={2}>
          {openTabs.map((tab) => (
            <PanelWrapper tab={tab} key={tab.name} />
          ))}
        </TabPanels>
      </Tabs>
    </HStack>
  );
};

export default Workspace;
