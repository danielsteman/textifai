import { ChatIcon, HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
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
import { addItemIfNotExist } from "../../common/utils/arrayManager";
import { FaBook, FaEdit } from "react-icons/fa";
import ColorModeSwitcher from "../../common/components/ColorModeSwitcher";

export type ITab = {
  name: string;
  panel: ReactNode;
};

export type ContextType = {
  openTabs: ITab[];
  setOpenTabs: Dispatch<SetStateAction<ITab[]>>;
};

const WorkspaceLayout = () => {
  const [openTabs, setOpenTabs] = useState<ITab[]>([
    { name: "Editor", panel: <Box>henk</Box> },
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
        <IconButton
          aria-label={"editor"}
          icon={<FaEdit />}
          onClick={() => setOpenTabs(addItemIfNotExist(openTabs, "Editor"))}
        />
        <Box w={2} />
        <IconButton
          aria-label={"documents"}
          icon={<FaBook />}
          onClick={() => setOpenTabs(addItemIfNotExist(openTabs, "Documents"))}
        />
        <Box w={2} />
        <IconButton
          aria-label={"chat"}
          icon={<ChatIcon />}
          onClick={() => setOpenTabs(addItemIfNotExist(openTabs, "Chat"))}
        />
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
        <Outlet context={{ openTabs, setOpenTabs } satisfies ContextType} />
      </Box>
    </Flex>
  );
};

export default WorkspaceLayout;
