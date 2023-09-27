import { IconButton, Image } from "@chakra-ui/react";
import { MdRocketLaunch } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import BoxLogo from "../../../public/box-logo.png";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <IconButton
      icon={<Image src={BoxLogo} alt="Box Logo" w={16} />}
      h="fit-content"
      variant="unstyled"
      aria-label={"App logo"}
      onClick={() => navigate("/")}
    />
  );
};

export default Logo;
