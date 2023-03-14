import { Avatar, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import auth from "../config/firebase";
import { NavLink } from "react-router-dom";

const AccountMenu = () => {
  return (
    <Menu>
      <MenuButton as={Avatar} bg="teal.500" size="sm" cursor="pointer" />
      <MenuList>
        <MenuItem as={NavLink} to="/settings">
          Account settings
        </MenuItem>
        <MenuItem onClick={() => auth.signOut()}>Sign out</MenuItem>
      </MenuList>
    </Menu>
  );
};

export default AccountMenu;
