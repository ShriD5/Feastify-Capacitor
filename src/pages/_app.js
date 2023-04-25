// pages/_app.js
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Montserrat } from "@fontsource/montserrat";

function MyApp({ Component, pageProps }) {
    const customTheme = extendTheme({
        fonts: {
            heading: "Montserrat",
            body: "Montserrat",
        },
    });

    return (
      <ChakraProvider theme={customTheme}>
        <Component {...pageProps} />
      </ChakraProvider>
  )
}

export default MyApp;