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
import EditorPanel from "../../features/Workspace/EditorPanel";
import { FaBook, FaEdit, FaFilePdf } from "react-icons/fa";
import { addItemIfNotExist } from "../../common/utils/arrayManager";
import ChatPanel from "../../features/Workspace/panels/ChatPanel";
import MegaLibraryPanel from "../../features/Workspace/MegaLibraryPanel";
import theme from "../../app/themes/theme";
import { auth } from "../../app/config/firebase";
import PdfViewerPanel from "../../features/Workspace/PdfViewerPanel";
import { ITab } from "src/app/routes/Workspace";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const { colorMode } = useColorMode();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <HStack h="100%">
      {/* Side Menu */}
      {isMenuOpen && (
        <VStack
          bgColor={theme.colors[colorMode].surfaceContainer}
          h="100%"
          p={2}
        >
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
              setOpenTabs(addItemIfNotExist(openTabs, tab, "name"));
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
              setOpenTabs(addItemIfNotExist(openTabs, tab, "name"));
              setCurrentTab(tab);
            }}
          />
          <IconButton
            aria-label={"Library"}
            icon={<FaBook />}
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
              setOpenTabs(addItemIfNotExist(openTabs, tab, "name"));
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