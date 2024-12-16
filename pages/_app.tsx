import Meta from "@/components/Meta";
import { AppProps } from "next/app";
import { withFronteggApp } from "@frontegg/nextjs/pages";
import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import Layout from "@/components/Layout";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <Meta 
      title="Dignified Travel"
      description="Curated Travel Experiences"
      keywords="travel, holiday"
      author="Dignified Labs"
      ogTitle="Dignified Travel"
      ogDescription="Curated Travel Experiences"
      ogImage="/images/napa-valley.jpg"
    />
    <Layout>
      <Component {...pageProps} />
    </Layout>
    </>
  );
}

export default withFronteggApp(MyApp, {
  hostedLoginBox: true,
  authOptions: {
    // keepSessionAlive: true, // Uncomment this to maintain the session alive
  }
});