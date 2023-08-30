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
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
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
import { FaBook, FaBookOpen, FaEdit } from "react-icons/fa";
import {
  addItemIfNotExist,
  removeItemIfExists,
} from "../../common/utils/arrayManager";
import ChatPanel from "../../features/WorkspaceTabs/ChatPanel";
import DocumentCollectionPanel from "../../features/WorkspaceTabs/DocumentCollectionPanel";

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
  const [openTabs, setOpenTabs] = useState<ITab[]>([]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [currentTab, setCurrentTab] = useState<ITab>();

  const onTabClose = (tab: ITab) => {
    setOpenTabs(removeItemIfExists(openTabs, tab));
  };

  const defaultTab: ITab = {
    name: "Editor",
    panel: <EditorPanel openChatSupport={false} openMiniLibrary={false} />,
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
              tab.name === currentTab?.name ? { borderBottom: "2px" } : {};
            return (
              <Box
                key={tab.name}
                flex={1}
                position={"relative"}
                {...activeProps}
              >
                <Tab
                  _hover={{ background: "teal" }}
                  px={12}
                  onClick={() => setCurrentTab(tab)}
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
        <IconButton
          aria-label={"library-support"}
          icon={<FaBookOpen />}
          onClick={() => {
            const targetIndex = openTabs.findIndex(
              (tab) => tab.name === "Library"
            );
            openTabs[targetIndex].openChatSupport = true;
          }}
        />
        <Box w={2} />
        <IconButton
          aria-label={"chat-support"}
          icon={<ChatIcon />}
          onClick={() => {
            const targetIndex = openTabs.findIndex(
              (tab) => tab.name === "Chat"
            );
            openTabs[targetIndex].openChatSupport = true;
          }}
        />
        <Box w={2} />
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
                      panel: (
                        <EditorPanel
                          openChatSupport={false}
                          openMiniLibrary={false}
                        />
                      ),
                      openChatSupport: false,
                      openMiniLibrary: false,
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
                      panel: (
                        <ChatPanel
                          openChatSupport={false}
                          openMiniLibrary={false}
                        />
                      ),
                      openChatSupport: false,
                      openMiniLibrary: false,
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
                      panel: (
                        <DocumentCollectionPanel
                          openChatSupport={false}
                          openMiniLibrary={false}
                        />
                      ),
                      openChatSupport: false,
                      openMiniLibrary: false,
                    };
                    setOpenTabs(addItemIfNotExist(openTabs, tab, "name"));
                    setCurrentTab(tab);
                    onClose();
                  }}
                >
                  Library
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
          <TabPanel
            key={tab.name}
            h="100%"
            flex="1"
            bgColor={"black"}
            borderRadius={16}
            p={2}
          >
            {tab.panel}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
};

export default Workspace;
