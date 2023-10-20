import { drawerAnatomy as parts } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/styled-system";
import { colors } from "./colors";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(parts.keys);

const baseStyle = definePartsStyle({
  dialog: {
    _dark: {
      borderRadius: 8,
      bg: colors.dark.surfaceContainer,
    },
  },
});

export const drawerTheme = defineMultiStyleConfig({
  baseStyle,
});
