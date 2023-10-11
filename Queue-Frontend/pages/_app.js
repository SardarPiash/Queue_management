import '@/styles/globals.css'
import Router from 'next/router';
import { useState } from 'react';
import Loading from './loading';

export default function App({ Component, pageProps }) {

  const [loading, setLoading] = useState(false);
  Router.events.on('routeChangeStart', () => {
    setLoading(true);
  });
  Router.events.on('routeChangeComplete', () => {
    setLoading(false);
  });

  return (
    <>
      {loading && <Loading />}
      <Component {...pageProps} />
    </>
  );
}
