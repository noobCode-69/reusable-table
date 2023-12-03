import { extendTheme } from "@chakra-ui/react";

const theme = {
  colors: {
    _gray: "#636363",
    _lightgray: "#E2E8F0",
  },

  breakpoints: {
    md: "70em",
  },
};

export { theme };

export default extendTheme(theme);
