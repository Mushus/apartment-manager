// import '../styles/globals.css';
import '@fontsource/roboto/500.css';
import type { AppProps } from 'next/app';
import { nextClient } from '@/trpc';

function App({ Component, pageProps }: AppProps) {
  const getLayout = (Component as any).getLayout || ((page: any) => page);

  return getLayout(<Component {...pageProps} />, pageProps);
}

export default nextClient.withTRPC(App);
