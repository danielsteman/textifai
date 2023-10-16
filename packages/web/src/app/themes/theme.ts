import {
  StyleFunctionProps,
  type ThemeConfig,
  extendTheme,
} from "@chakra-ui/react";

const colors = {
  dark: {
    primary: "#3CDCCF",
    onPrimary: "#003733",
    primaryContainer: "#00504A",
    onPrimaryContainer: "#62F9EB",
    primaryFixed: "#62F9EB",
    secondary: "#B1CCC8",
    onSecondary: "#1C3532",
    secondaryContainer: "#324B48",
    onSecondaryContainer: "#CCE8E4",
    tertiary: "#AFC9E7",
    onTertiary: "#17324A",
    tertiaryContainer: "#2F4961",
    onTertiaryContainer: "#CEE5FF",
    error: "#FFB4AB",
    onError: "#690005",
    errorContainer: "#93000A",
    onErrorContainer: "#FFDAD6",
    surfaceDim: "#101413",
    surface: "#101413",
    surfaceBright: "#363A39",
    surfaceContainerLowest: "#0B0F0E",
    surfaceContainerLow: "#191C1C",
    surfaceContainer: "#1D2020",
    surfaceContainerHigh: "#272B2A",
    surfaceContainerHighest: "#323535",
    onSurface: "#C4C7C6",
    onSurfaceVariant: "#BEC9C6",
    outline: "#899391",
    outlineVariant: "#3F4947",
    inverseSurface: "#E0E3E1",
    inverseOnSurface: "#191C1C",
    scrim: "#000000",
    shadow: "#000000",
  },
  light: {
    // generated by ChatGPT. "What is the counter part of taiDark?"
    primary: "#006A63",
    onPrimary: "#FFFFFF",
    primaryContainer: "#62F9EB",
    onPrimaryContainer: "#00201D",
    primaryFixed: "#62F9EB",
    secondary: "#4A6360",
    onSecondary: "#FFFFFF",
    secondaryContainer: "#CCE8E4",
    onSecondaryContainer: "#051F1D",
    tertiary: "#47617A",
    onTertiary: "#FFFFFF",
    tertiaryContainer: "#CEE5FF",
    onTertiaryContainer: "#001D33",
    error: "#BA1A1A",
    onError: "#FFFFFF",
    errorContainer: "#FFDAD6",
    onErrorContainer: "#410002",
    surfaceDim: "#D8DBD9",
    surface: "#F7FAF8",
    surfaceBright: "#F7FAF8",
    surfaceContainerLowest: "#FFFFFF",
    surfaceContainerLow: "#F2F4F2",
    surfaceContainer: "#ECEEED",
    surfaceContainerHigh: "#E6E9E7",
    surfaceContainerHighest: "#E0E3E1",
    onSurface: "#191C1C",
    onSurfaceVariant: "#3F4947",
    outline: "#6F7977",
    outlineVariant: "#BEC9C6",
    inverseSurface: "#2D3130",
    inverseOnSurface: "#EFF1F0",
    scrim: "#000000",
    shadow: "#000000",
  },
  google: {
    50: "#D84B37",
    100: "#D84B37",
    200: "#D84B37",
    300: "#D84B37",
    400: "#D84B37",
    500: "#D84B37",
    600: "#cc3c27",
    700: "#cc3c27",
    800: "#cc3c27",
    900: "#cc3c27",
  },
};

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
  },
};

const theme = extendTheme(config);

export default theme;
