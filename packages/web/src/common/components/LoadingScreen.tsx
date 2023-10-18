import { Center, Spinner, useColorMode } from "@chakra-ui/react";
import theme from "../../app/themes/theme";

const LoadingScreen = () => {
  const { colorMode } = useColorMode();
  return (
    <Center
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg={theme.colors[colorMode].surface}
      zIndex={9999}
    >
      <Spinner size="xl" color={theme.colors[colorMode].primary} />
    </Center>
  );
};

export default LoadingScreen;
