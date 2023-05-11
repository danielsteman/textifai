import { ButtonGroup } from "@chakra-ui/react";
import NavigationButton from "./NavigationButton";

const Navigation = () => {
  const products = ["product1", "product2", "product3"];
  return (
    <ButtonGroup>
      <NavigationButton
        title="Products"
        subitems={products}
      ></NavigationButton>
      <NavigationButton title="Docs"></NavigationButton>
      <NavigationButton title="Pricing"></NavigationButton>
      <NavigationButton title="Support"></NavigationButton>
    </ButtonGroup>
  );
};

export default Navigation;
