import { IconButton } from "@chakra-ui/react";
import { MdRocketLaunch } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <IconButton
      icon={<MdRocketLaunch size={40} />}
      variant="unstyled"
      aria-label={"App logo"}
      onClick={() => navigate("/")}
    />
  );
};

export default Logo;
