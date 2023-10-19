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
      <NavigationButton title="Docs"></NavigationButton>
      <NavigationButton title="Pricing"></NavigationButton>
      <NavigationButton title="Support"></NavigationButton>
    </ButtonGroup>
  );
};

export default Navigation;
