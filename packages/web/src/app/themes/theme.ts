import { extendTheme } from "@chakra-ui/react";

const config = {
  colors: {
    textifai_dark:{
      primary: "#3CDCCF",
      on_primary: "#003733",
      primary_container: "#00504A",
      on_primary_container: "#62F9EB",
      primary_fixed: "#62F9EB",
      secondary: "#B1CCC8",
      on_secondary: "#1C3532",
      secondary_container: "#324B48",
      on_secondary_container: "#CCE8E4",
      tertiary: "#AFC9E7",
      on_tertiary: "#17324A",
      tertiary_container: "#2F4961",
      on_tertiary_container: "#CEE5FF",
      error: "#FFB4AB",
      on_error: "#690005",
      error_container: "#93000A",
      on_error_container: "#FFDAD6",
      surface_dim: "#101413",
      surface: "#101413",
      surface_bright: "#363A39",
      surface_cont_lowest: "#0B0F0E",
      surface_cont_low: "#191C1C",
      surface_container: "#1D2020",
      surface_cont_high: "#272B2A",
      surface_cont_highest: "#323535",
      on_surface: "#C4C7C6",
      on_surface_variant: "#BEC9C6",
      outline: "#899391",
      outline_variant: "#3F4947",
      inverse_surface: "#E0E3E1",
      inverse_on_surface: "#191C1C",
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
  },
};

const theme = extendTheme(config);

export default theme;
