import { ChatIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
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
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import ColorModeSwitcher from "../../common/components/ColorModeSwitcher";
import EditorPanel from "../../features/WorkspaceTabs/EditorPanel";
import { FaBook, FaEdit } from "react-icons/fa";
import {
  addItemIfNotExist,
  removeItemIfExists,
} from "../../common/utils/arrayManager";
import ChatPanel from "../../features/WorkspaceTabs/ChatPanel";
import DocumentCollectionPanel from "../../features/WorkspaceTabs/DocumentCollectionPanel";
import CustomTab from "../../common/components/CustomTab";

export type ITab = {
  name: string;
  panel: ReactNode;
};

export type OpenTabsContext = {
  openTabs: ITab[];
  setOpenTabs: Dispatch<SetStateAction<ITab[]>>;
};

const Workspace = () => {
  const [openTabs, setOpenTabs] = useState<ITab[]>([
    { name: "Editor", panel: <EditorPanel /> },
  ]);

  const onTabClose = (tab: ITab) => {
    setOpenTabs(removeItemIfExists(openTabs, tab));
  };

  const onTabOpen = (tab: ITab) => {
    setOpenTabs(addItemIfNotExist(openTabs, tab));
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex direction="column" h="100%">
      <Tabs variant="soft-rounded" size="sm">
        <Flex direction="row" p={2}>
          <TabList mb="1em">
            {openTabs.map((tab) => (
              <CustomTab
                key={tab.name}
                tab={tab}
                onOpen={onTabOpen}
                onClose={onTabClose}
              />
            ))}
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
                      setOpenTabs(
                        addItemIfNotExist(
                          openTabs,
                          { name: "Editor", panel: <EditorPanel /> },
                          "name"
                        )
                      );
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
                      setOpenTabs(
                        addItemIfNotExist(
                          openTabs,
                          { name: "Chat", panel: <ChatPanel /> },
                          "name"
                        )
                      );
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
                      setOpenTabs(
                        addItemIfNotExist(
                          openTabs,
                          {
                            name: "Documents",
                            panel: <DocumentCollectionPanel />,
                          },
                          "name"
                        )
                      );
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
        <TabPanels>
          {openTabs.map((tab) => (
            <TabPanel key={tab.name}>{tab.panel}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Workspace;
