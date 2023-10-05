import React, { useState } from "react";
import { ChatIcon, SmallCloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  HStack,
  IconButton,
  Spacer,
  VStack,
  Divider,
  useColorMode,
} from "@chakra-ui/react";
import ColorModeSwitcher from "../../common/components/ColorModeSwitcher";
import UserCard from "../../common/components/UserCard";
import EditorPanel from "../../features/Workspace/panels/EditorPanel";
import { FaBook, FaEdit, FaFilePdf } from "react-icons/fa";
import { addItemIfNotExists } from "../../common/utils/arrayManager";
import ChatPanel from "../../features/Workspace/panels/ChatPanel";
import MegaLibraryPanel from "../../features/Workspace/panels/MegaLibraryPanel";
import theme from "../../app/themes/theme";
import PdfViewerPanel from "../../features/Workspace/panels/PdfViewerPanel";
import { ITab } from "../../features/Workspace/Workspace";

type SidebarMenuProps = {
  openTabs: ITab[];
  setOpenTabs: React.Dispatch<React.SetStateAction<ITab[]>>;
  setCurrentTab: React.Dispatch<React.SetStateAction<ITab | undefined>>;
};

const SidebarMenu: React.FC<SidebarMenuProps> = ({
  openTabs,
  setOpenTabs,
  setCurrentTab,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const { colorMode } = useColorMode();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
              icon={<SmallCloseIcon />}
              onClick={toggleMenu}
              mb={2}
            />
          </Flex>
          <UserCard />
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
              setOpenTabs(addItemIfNotExists(openTabs, tab, "name"));
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
              setOpenTabs(addItemIfNotExists(openTabs, tab, "name"));
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
                openPdfViewer: false,
              };
              setOpenTabs(addItemIfNotExists(openTabs, tab, "name"));
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
              setOpenTabs(addItemIfNotExists(openTabs, tab, "name"));
              setCurrentTab(tab);
            }}
          >
            Pdf Viewer
          </Button>
          <Spacer />
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
              setOpenTabs(addItemIfNotExists(openTabs, tab, "name"));
              setCurrentTab(tab);
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
              setOpenTabs(addItemIfNotExists(openTabs, tab, "name"));
              setCurrentTab(tab);
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
              setOpenTabs(addItemIfNotExists(openTabs, tab, "name"));
              setCurrentTab(tab);
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
              setOpenTabs(addItemIfNotExists(openTabs, tab, "name"));
              setCurrentTab(tab);
            }}
          />
          <Spacer />
          <ColorModeSwitcher />
        </VStack>
      )}
    </HStack>
  );
};

export default SidebarMenu;
