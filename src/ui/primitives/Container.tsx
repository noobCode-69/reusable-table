import { ContainerProps, Container as ChakraContainer } from "@chakra-ui/react";

export default function Container({ children, ...rest }: ContainerProps) {
  return (
    <ChakraContainer
      maxW={{ base: "100vw", md: "140ch" }}
      paddingX={{ base: "1rem", md: "1.7rem" }}
      {...rest}
    >
      {children}
    </ChakraContainer>
  );
}
