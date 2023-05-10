import { ButtonGroup } from "@chakra-ui/react";
import NavigationButton from "./NavigationButton";

const Navigation = () => {
  const products = ["product1", "product2", "product3"];
  return (
    <ButtonGroup>
      <NavigationButton
        to="/products"
        title="Products"
        subitems={products}
      ></NavigationButton>
      <NavigationButton to="/docs" title="Docs"></NavigationButton>
      <NavigationButton to="/pricing" title="Pricing"></NavigationButton>
      <NavigationButton to="/support" title="Support"></NavigationButton>
    </ButtonGroup>
  );
};

export default Navigation;
