import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
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
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import { Dispatch, ReactNode, SetStateAction, useState } from "react";
import { Outlet } from "react-router-dom";
import ColorModeSwitcher from "../../common/components/ColorModeSwitcher";
import TextEditor from "../../features/TextEditor/TextEditor";
import OpenEditorTab from "../../features/WorkspaceTabs/OpenEditorTab";
import OpenDocumentCollectionTab from "../../features/WorkspaceTabs/OpenDocumentCollectionTab";
import OpenChatTab from "../../features/WorkspaceTabs/OpenChatTab";

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
    { name: "Editor", panel: <TextEditor /> },
  ]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <Flex direction="column" h="100%">
      <Flex direction="row" p={2}>
        <IconButton
          aria-label={"settings"}
          icon={<SettingsIcon />}
          onClick={onOpen}
        />
        <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Workspace settings</DrawerHeader>
            <DrawerBody>
              <Input placeholder="Search..." />
            </DrawerBody>
            <DrawerFooter>
              <ColorModeSwitcher />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
        <Box w={4} />
        <Breadcrumb alignSelf={"center"}>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>
            <BreadcrumbLink href="/features/workspace">
              Workspace
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Spacer />
        <OpenEditorTab openTabs={openTabs} setOpenTabs={setOpenTabs} />
        <Box w={2} />
        <OpenDocumentCollectionTab
          openTabs={openTabs}
          setOpenTabs={setOpenTabs}
        />
        <Box w={2} />
        <OpenChatTab openTabs={openTabs} setOpenTabs={setOpenTabs} />
        <Box w={2} />
        <Menu>
          <MenuButton as={Button} p={0}>
            <HamburgerIcon />
          </MenuButton>
          <MenuList>
            <MenuItem>MenuItem1</MenuItem>
            <MenuDivider />
            <MenuItem>MenuItem2</MenuItem>
            <MenuItem>MenuItem3</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
      <Box px={2}>
        <Outlet context={{ openTabs, setOpenTabs } satisfies OpenTabsContext} />
      </Box>
    </Flex>
  );
};

export default WorkspaceLayout;
