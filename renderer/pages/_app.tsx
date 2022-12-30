import '../styles/globals.scss';
import '@fontsource/roboto/500.css';
import type { AppProps } from 'next/app';
import { nextClient } from '@/trpc';
import { NoSsr } from '@mui/material';

function App({ Component, pageProps }: AppProps) {
  const Layout = (Component as any).getLayout || ((page: any) => page);

  return (
    <NoSsr>
      <Component {...pageProps} />
    </NoSsr>
  );
}

export default nextClient.withTRPC(App);
