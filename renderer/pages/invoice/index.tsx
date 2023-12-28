import Layout from '@/components/Layout';
import { useEffect, useMemo } from 'react';
import { configurePage } from '@/components/page/Page';
import Loading from '@/components/page/Loading';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

export default configurePage({
  layout: ({ children }) => (
    <Layout title="レシート発行" prev="/">
      {children}
    </Layout>
  ),
  page: () => {
    const router = useRouter();
    const month = useMemo(() => dayjs().format('YYYY-MM'), []);

    useEffect(() => {
      router.push(`/invoice/list/${month}`);
    }, []);

    return <Loading />;
  },
});
