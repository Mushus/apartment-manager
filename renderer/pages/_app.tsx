import '@/styles/globals.scss';
import '@fontsource/roboto/500.css';
import type { AppProps } from 'next/app';
import { nextClient } from '@/trpc';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default nextClient.withTRPC(App);
