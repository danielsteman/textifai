import { Icon, Text, Button, Spacer, Flex } from "@chakra-ui/react";
import { IconType } from "react-icons";
import { useNavigate } from "react-router-dom";

interface Props {
  name: string;
  icon: IconType;
  href?: string;
}

const MenuItem: React.FC<Props> = ({ name, icon, href }) => {
  const navigate = useNavigate();
  return (
    <Button
      p={2}
      size="sm"
      variant={"ghost"}
      onClick={href ? () => navigate(href) : undefined}
    >
      <Flex alignItems={"left"} w={"100%"}>
        <Text fontSize={"md"}>{name}</Text>
        <Spacer />
        <Icon as={icon} />
      </Flex>
    </Button>
  );
};

export default MenuItem;
