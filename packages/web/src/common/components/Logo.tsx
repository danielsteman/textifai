import { IconButton, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import BoxLogo from "/box-logo.png";

const Logo = () => {
  const navigate = useNavigate();
  return (
    <IconButton
      icon={<Image src={BoxLogo} alt="Box Logo" w={16} />}
      h="fit-content"
      aria-label={"App logo"}
      onClick={() => navigate("/")}
      variant="unstyled"
    ></IconButton>
  );
};

export default Logo;
