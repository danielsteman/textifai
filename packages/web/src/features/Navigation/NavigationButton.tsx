import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Button,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { NavLink } from "react-router-dom";
import { formatStringAsRoute } from "../../common/utils/formatStrings";
import { NavigationButtonData } from "./Navigation";

interface Props {
  title: string;
  menudata?: NavigationButtonData;
}

const NavigationButton: React.FC<Props> = ({ title, menudata }) => (
  <>
    {menudata ? (
      <Menu>
        <MenuButton
          variant="ghost"
          size="md"
          as={Button}
          rightIcon={<ChevronDownIcon />}
        >
          {title}
        </MenuButton>
        <MenuList>
          <MenuItem as={NavLink} to={`/${menudata.collectionRoute}`}>
            {menudata.collectionTitle}
          </MenuItem>
          <MenuDivider />
          {menudata.children.map((item, index) => (
            <MenuItem
              key={index}
              as={NavLink}
              to={`/${menudata.collectionRoute}/${formatStringAsRoute(item)}`}
            >
              {item}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    ) : (
      <Button
        variant="ghost"
        size="md"
        as={NavLink}
        to={`/${title.toLowerCase()}`}
      >
        {title}
      </Button>
    )}
  </>
);

export default NavigationButton;
