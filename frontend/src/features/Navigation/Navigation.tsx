import { ButtonGroup } from "@chakra-ui/react";
import NavigationButton from "./NavigationButton";

export interface NavigationButtonData {
  collectionTitle: string;
  collectionRoute: string;
  children: string[];
}

const Navigation = () => {
  const products: NavigationButtonData = {
    collectionTitle: "All products",
    collectionRoute: "products",
    children: ["Product 1", "Product 2", "Product 3"],
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
