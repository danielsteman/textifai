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
  Grid,
  GridItem,
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
import { FaBook, FaEdit } from "react-icons/fa";
import {
  addItemIfNotExist,
  removeItemIfExists,
} from "../../common/utils/arrayManager";
import ChatPanel from "../../features/WorkspaceTabs/ChatPanel";
import DocumentCollectionPanel from "../../features/WorkspaceTabs/DocumentCollectionPanel";

export type ITab = {
  name: string;
  panel: ReactNode;
  colSpan: number;
  rowSpan: number;
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
    panel: <EditorPanel />,
    colSpan: 1,
    rowSpan: 2,
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
                      colSpan: 1,
                      rowSpan: 2,
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
                    const tab = {
                      name: "Chat",
                      panel: <ChatPanel />,
                      colSpan: 1,
                      rowSpan: 1,
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
                    const tab = {
                      name: "Library",
                      panel: <DocumentCollectionPanel />,
                      colSpan: 1,
                      rowSpan: 1,
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
        <Grid
          h="100%"
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(2, 1fr)"
          gap={4}
        >
          {openTabs.map((tab) => (
            <GridItem
              rowSpan={tab.rowSpan}
              colSpan={tab.colSpan}
              key={tab.name}
            >
              <TabPanel
                h="100%"
                flex="1"
                bgColor={"black"}
                borderRadius={16}
                p={2}
              >
                {tab.panel}
              </TabPanel>
            </GridItem>
          ))}
        </Grid>
      </TabPanels>
    </Tabs>
  );
};

export default Workspace;
