import { StyleFunctionProps, extendTheme } from "@chakra-ui/react";

import { modalTheme } from "./modalTheme";
import { colors } from "./colors";
import { drawerTheme } from "./drawerTheme";

const config = {
  colors: colors,
  initialColorMode: "dark",
  useSystemColorMode: false,
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        bgColor: colors[props.colorMode].surface,
      },
    }),
  },
  fonts: {
    body: "Roboto",
  },
  components: {
    Menu: {
      parts: ["list", "item"],
      baseStyle: (props: StyleFunctionProps) => ({
        list: {
          bgColor: colors[props.colorMode].surfaceContainerHigh,
          border: 0,
        },
        item: {
          bgColor: colors[props.colorMode].surfaceContainerHigh,
          border: 0,
          _hover: {
            bgColor: colors[props.colorMode].surfaceContainerHighest,
          },
        },
      }),
    },
    Modal: modalTheme,
    Drawer: drawerTheme,
  },
};

const theme = extendTheme(config);

export default theme;
