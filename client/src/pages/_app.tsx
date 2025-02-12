import { AppProps } from 'next/app';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import '@/assets/styles/index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
    },
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (
      localStorage.getItem('darkMode') === 'true' ||
      (!('darkMode' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.body.classList.add('dark');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </QueryClientProvider>
  );
}

export default MyApp;
