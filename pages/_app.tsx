import { AppProps } from "next/app";
import { withFronteggApp } from "@frontegg/nextjs/pages";
import CustomNavbar from "../components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <CustomNavbar />
      <Component {...pageProps} />
    </>
  );
}

export default withFronteggApp(MyApp, {
  hostedLoginBox: true,
  authOptions: {
    // keepSessionAlive: true, // Uncomment this to maintain the session alive
  },
});

