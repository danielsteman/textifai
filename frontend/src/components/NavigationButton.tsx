import { Button } from "@chakra-ui/react";
import { NavLink, To } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  to: To;
}

const NavigationButton: React.FC<Props> = ({ children, to }) => (
  <Button size="sm" as={NavLink} to={to}>
    {children}
  </Button>
);

export default NavigationButton;
