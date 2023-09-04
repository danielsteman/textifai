import { extendTheme } from "@chakra-ui/react";

const config = {
  colors: {
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
      primary: "#009688",
      onPrimary: "#FFFFFF",
      primaryContainer: "#4DB6AC",
      onPrimaryContainer: "#003733",
      primaryFixed: "#003733",
      secondary: "#80CBC4",
      onSecondary: "#003733",
      secondaryContainer: "#B2DFDB",
      onSecondaryContainer: "#1C3532",
      tertiary: "#B0BEC5",
      onTertiary: "#003733",
      tertiaryContainer: "#ECEFF1",
      onTertiaryContainer: "#17324A",
      error: "#FF6E40",
      onError: "#FFFFFF",
      errorContainer: "#FFAB91",
      onErrorContainer: "#690005",
      surfaceDim: "#FAFAFA",
      surface: "#FFFFFF",
      surfaceBright: "#F5F5F5",
      surfaceContainerLowest: "#EDEDED",
      surfaceContainerLow: "#E0E0E0",
      surfaceContainer: "#D3D3D3",
      surfaceContainerHigh: "#C6C6C6",
      surfaceContainerHighest: "#B9B9B9",
      onSurface: "#333333",
      onSurfaceVariant: "#444444",
      outline: "#C0C0C0",
      outlineVariant: "#888888",
      inverseSurface: "#000000",
      inverseOnSurface: "#FFFFFF",
      scrim: "#FFFFFF",
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
  },
};

const theme = extendTheme(config);

export default theme;
