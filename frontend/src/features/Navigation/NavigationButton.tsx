import { ChevronDownIcon } from "@chakra-ui/icons";
import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { NavLink, To } from "react-router-dom";

interface Props {
  title: string;
  subitems?: string[];
}

const NavigationButton: React.FC<Props> = ({ title, subitems }) => (
  <>
    {subitems ? (
      <Menu>
        <MenuButton
          variant="ghost"
          size="sm"
          as={Button}
          rightIcon={<ChevronDownIcon />}
        >
          {title}
        </MenuButton>
        <MenuList>
          {subitems.map((item, index) => (
            <MenuItem
              key={index}
              as={NavLink}
              to={`/products/${item.toLowerCase()}`}
            >
              {item}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    ) : (
      <Button
        variant="ghost"
        size="sm"
        as={NavLink}
        to={`/${title.toLowerCase()}`}
      >
        {title}
      </Button>
    )}
  </>
);

export default NavigationButton;
