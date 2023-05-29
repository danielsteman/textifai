import * as React from "react";
import {
  useColorMode,
  useColorModeValue,
  IconButton,
  IconButtonProps,
  Tooltip,
} from "@chakra-ui/react";
import { FaMoon, FaSun } from "react-icons/fa";

type ColorModeSwitcherProps = Omit<IconButtonProps, "aria-label">;

const ColorModeSwitcher: React.FC<ColorModeSwitcherProps> = (props) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const text = useColorModeValue("dark", "light");
  const SwitchIcon = useColorModeValue(FaMoon, FaSun);
  const tooltipLabel = `Switch to ${
    colorMode === "light" ? "dark" : "light"
  } mode`;

  return (
    <Tooltip label={tooltipLabel}>
      <IconButton
        size="md"
        fontSize="lg"
        variant="ghost"
        color="current"
        onClick={toggleColorMode}
        icon={<SwitchIcon size={20} />}
        aria-label={`Switch to ${text} mode`}
        {...props}
      />
    </Tooltip>
  );
};

export default ColorModeSwitcher;
