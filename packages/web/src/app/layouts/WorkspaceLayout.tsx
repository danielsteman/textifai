import { ChatIcon, HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
} from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { Outlet } from "react-router-dom";
import { addItemIfNotExist } from "../../common/utils/arrayManager";
import { FaBook } from "react-icons/fa";

export type ContextType = {
  openTabs: string[];
  setOpenTabs: Dispatch<SetStateAction<string[]>>;
};

const WorkspaceLayout = () => {
  const [openTabs, setOpenTabs] = useState<string[]>(["Editor"]);
  return (
    <Flex direction="column" h="100%">
      <Flex direction="row" p={2}>
        <IconButton aria-label={"settings"} icon={<SettingsIcon />} />
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
          aria-label={"chat"}
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
