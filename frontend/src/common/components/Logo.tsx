import { IconButton } from "@chakra-ui/react";
import { MdRocketLaunch } from "react-icons/md";

// TODO: Link to root onClick

const Logo = () => (
  <IconButton
    icon={<MdRocketLaunch size={40} />}
    variant="unstyled"
    aria-label={"App logo"}
  />
);

export default Logo;
