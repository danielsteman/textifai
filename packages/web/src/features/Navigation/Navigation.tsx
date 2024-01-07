import { ButtonGroup } from "@chakra-ui/react";
import NavigationButton from "./NavigationButton";

export interface NavigationButtonData {
  collectionTitle: string;
  collectionRoute: string;
  children: string[];
}

const Navigation = () => {
  return (
    <ButtonGroup>
      <NavigationButton title="About"></NavigationButton>
      <NavigationButton title="Solutions"></NavigationButton>
      <NavigationButton title="Pricing"></NavigationButton>
      <NavigationButton title="Blog"></NavigationButton>
      <NavigationButton title="Learn"></NavigationButton>
      <NavigationButton title="Contact us"></NavigationButton>
    </ButtonGroup>
  );
};

export default Navigation;
