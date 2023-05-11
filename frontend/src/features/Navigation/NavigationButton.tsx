import { ArrowDownIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { NavLink, To } from "react-router-dom";

// TODO: allow NavigationButton to become Menu with MenuItems that navigate() to a page according to its children

interface Props {
  children?: React.ReactNode;
  title: string;
  to: To;
  subitems?: string[];
}

const NavigationButton: React.FC<Props> = ({
  children,
  title,
  to,
  subitems,
}) => (
  <>
    {subitems ? (
      <Menu>
        <MenuButton size="sm" as={Button} rightIcon={<ChevronDownIcon />}>
          {title}
        </MenuButton>
        <MenuList>
          {subitems.map((item, index) => (
            <MenuItem key={index}>{item}</MenuItem>
          ))}
        </MenuList>
      </Menu>
    ) : (
      <Button size="sm" as={NavLink} to={to}>
        {title}
      </Button>
    )}
  </>
);

export default NavigationButton;
