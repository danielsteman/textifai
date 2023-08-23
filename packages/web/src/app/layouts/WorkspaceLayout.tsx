import { ChatIcon, HamburgerIcon } from "@chakra-ui/icons";
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
import { Outlet } from "react-router-dom";

const WorkspaceLayout = () => {
  return (
    <Flex direction="column" h="100%" p={0}>
      <Flex direction="row">
        <IconButton aria-label={"settings"} icon={<HamburgerIcon />} />
        <Breadcrumb>
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
        <IconButton aria-label={"chat"} icon={<ChatIcon />} />
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
      <Box>
        <Outlet />
      </Box>
    </Flex>
  );
};

export default WorkspaceLayout;
