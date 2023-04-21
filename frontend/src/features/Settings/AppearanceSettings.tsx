import { HStack, Text, useColorMode } from "@chakra-ui/react";
import ColorModeSwitcher from "../../common/components/ColorModeSwitcher";

const AppearanceSettings = () => {
  const currentTheme = useColorMode();
  const togglableTheme = currentTheme.colorMode === "dark" ? "light" : "dark";
  return (
    <HStack>
      <Text>Switch to {togglableTheme}mode:</Text>
      <ColorModeSwitcher />
    </HStack>
  );
};

export default AppearanceSettings;
