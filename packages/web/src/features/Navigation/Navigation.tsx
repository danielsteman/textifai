import {
  ButtonGroup,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
} from "@chakra-ui/react";
import { useBreakpointValue } from "@chakra-ui/react";
import NavigationButton from "./NavigationButton";
import { HamburgerIcon } from "@chakra-ui/icons";
import LoginOrRegisterModal from "../Authentication/LoginOrRegisterModal";

export interface NavigationButtonData {
  collectionTitle: string;
  collectionRoute: string;
  children: string[];
}

const Navigation = () => {
  const isMobile = useBreakpointValue({ base: true, sm: false });
  const items = [
    "About",
    "Solutions",
    "Pricing",
    "Blog",
    "Learn",
    "Contact us",
  ];

  if (isMobile) {
    return (
      <Menu>
        <Spacer />
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<HamburgerIcon />}
          variant="outline"
        />
        <MenuList>
          {items.map((item) => (
            <MenuItem>{item}</MenuItem>
          ))}
          <LoginOrRegisterModal
            loginOrRegister="signUp"
            authProviders={["google"]}
          />
          <LoginOrRegisterModal
            loginOrRegister="signIn"
            authProviders={["google"]}
          />
        </MenuList>
      </Menu>
    );
  } else {
    return (
      <ButtonGroup>
        {items.map((item) => (
          <NavigationButton title={item}></NavigationButton>
        ))}
      </ButtonGroup>
    );
  }
};

export default Navigation;
