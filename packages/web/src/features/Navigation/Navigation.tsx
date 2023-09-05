import { ButtonGroup } from "@chakra-ui/react";
import NavigationButton from "./NavigationButton";

export interface NavigationButtonData {
  collectionTitle: string;
  collectionRoute: string;
  children: string[];
}

const Navigation = () => {
  const features: NavigationButtonData = {
    collectionTitle: "See all",
    collectionRoute: "features",
    children: ["Assistant", "Upload", "Editor", "Workspace", "PdfViewer"],
  };
  return (
    <ButtonGroup>
      <NavigationButton title="Features" menudata={features}></NavigationButton>
      <NavigationButton title="Docs"></NavigationButton>
      <NavigationButton title="Pricing"></NavigationButton>
      <NavigationButton title="Support"></NavigationButton>
    </ButtonGroup>
  );
};

export default Navigation;
