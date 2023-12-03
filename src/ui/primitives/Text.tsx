import { TextProps, Text as ChakraText } from "@chakra-ui/react";
import { poppins } from "../shared/font/poppin-font";
import { ReactNode } from "react";

export interface CustomTextProps extends TextProps {
  children: ReactNode;
}

/**
 * Custom abstraction over chakra Text element
 * it's primary designed to support
 * i18n translations (but it's not needed in this project)
 *
 * @see Docs https://chakra-ui.com/text
 */

const Text = ({ children, ...props }: CustomTextProps) => {
  return (
    <ChakraText {...defaultStyles} {...props}>
      {children}
    </ChakraText>
  );
};

const defaultStyles = {
  fontFamily: poppins.style.fontFamily,
  letterSpacing: "-0.01em",
};

export default Text;
