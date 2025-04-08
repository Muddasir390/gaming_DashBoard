import { Fragment } from "react";
import Head from "next/head";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import "./global.css";
 
function MyApp({ Component, pageProps }: AppProps) {
const queryClient = new QueryClient();

  return (
    <Fragment>
         <div className="absolute !z-[999999999999999999999999] !left-20">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
        <ToastContainer />
        <QueryClientProvider client={queryClient}>
      <Head>
        <title>ZOAVERSE</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        {/* Add the favicon link here */}
        <link rel="icon" href="/AppIconBlack.ico"/>
        {/* <div aria-hidden="true">
        <span className="font-preloader preload-thin">.</span>
        <span className="font-preloader preload-bold">.</span>
      </div> */}
        {/* <link
          rel="preload"
          href="../public/fonts/TheSans-Plain.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        /> */}
      </Head>
      <Component {...pageProps} />
    </QueryClientProvider>
    </Fragment>
  );
}

export default MyApp;
