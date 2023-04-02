import { ButtonGroup } from "@chakra-ui/react";
import NavigationButton from "./NavigationButton";

const Navigation = () => (
  <ButtonGroup>
    <NavigationButton to="/products">Products</NavigationButton>
    <NavigationButton to="/docs">Docs</NavigationButton>
    <NavigationButton to="/pricing">Pricing</NavigationButton>
    <NavigationButton to="/support">Support</NavigationButton>
  </ButtonGroup>
);

export default Navigation;
