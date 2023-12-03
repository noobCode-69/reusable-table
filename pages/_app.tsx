import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "@/src/styles/theme";
import Head from "next/head";
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Chakra Reusable Table </title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
