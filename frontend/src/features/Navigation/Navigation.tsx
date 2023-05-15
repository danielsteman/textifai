import { ButtonGroup } from "@chakra-ui/react";
import NavigationButton from "./NavigationButton";

export interface NavigationButtonData {
  collectionTitle: string;
  collectionRoute: string;
  children: string[];
}

const Navigation = () => {
  const products: NavigationButtonData = {
    collectionTitle: "See all",
    collectionRoute: "products",
    children: ["Textifai"],
  };
  return (
    <ButtonGroup>
      <NavigationButton title="Products" menudata={products}></NavigationButton>
      <NavigationButton title="Docs"></NavigationButton>
      <NavigationButton title="Pricing"></NavigationButton>
      <NavigationButton title="Support"></NavigationButton>
    </ButtonGroup>
  );
};

export default Navigation;
