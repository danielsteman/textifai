import { ChatIcon, SettingsIcon } from "@chakra-ui/icons";
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
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Outlet } from "react-router-dom";
import ColorModeSwitcher from "../../common/components/ColorModeSwitcher";
import EditorPanel from "../../features/WorkspaceTabs/EditorPanel";
import { FaBook, FaEdit } from "react-icons/fa";
import { addItemIfNotExist } from "../../common/utils/arrayManager";
import ChatPanel from "../../features/WorkspaceTabs/ChatPanel";
import DocumentCollectionPanel from "../../features/WorkspaceTabs/DocumentCollectionPanel";

export type ITab = {
  name: string;
  panel: ReactNode;
};

export type OpenTabsContext = {
  openTabs: ITab[];
  setOpenTabs: Dispatch<SetStateAction<ITab[]>>;
};

const WorkspaceLayout = () => {
  const [openTabs, setOpenTabs] = useState<ITab[]>([
    { name: "Editor", panel: <EditorPanel /> },
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex direction="column" h="100%">
      <Flex direction="row" p={2}>
        <Spacer />
        <IconButton
          aria-label={"settings"}
          icon={<SettingsIcon />}
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
      <Box px={2}>
        <Outlet context={{ openTabs, setOpenTabs } satisfies OpenTabsContext} />
      </Box>
    </Flex>
  );
};

export default WorkspaceLayout;
