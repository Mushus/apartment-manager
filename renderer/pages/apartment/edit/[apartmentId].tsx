import z from 'zod';
import Layout from '@/components/Layout';
import { client, nextClient } from '@/trpc';
import { configurePage } from '@/components/page/Page';
import Loading from '@/components/page/Loading';
import ApartmentEdit, { ExternalApartment } from '@/components/page/ApartmentEdit';
import { useRouter } from 'next/router';

export default configurePage({
  query: z.object({ apartmentId: z.string() }),
  layout: ({ children }) => (
    <Layout title="アパート編集" prev="/apartment">
      {children}
    </Layout>
  ),
  page: ({ query }) => {
    const router = useRouter();
    const util = nextClient.useContext();
    const { data: apartment, isLoading } = nextClient.apartment.get.useQuery(query);

    const handleSave = async (apartment: ExternalApartment) => {
      if (!apartment.id) return;
      client.apartment.update.mutate({ ...apartment, id: apartment.id });
      router.push('/apartment');
      util.invalidate();
    };

    return apartment && !isLoading ? <ApartmentEdit apartment={apartment} onSave={handleSave} /> : <Loading />;
  },
});
