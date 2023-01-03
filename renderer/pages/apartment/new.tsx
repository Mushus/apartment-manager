import Layout from '@/components/Layout';
import { configurePage } from '@/components/page/Page';
import ApartmentEdit, { ExternalApartment } from '@/components/page/ApartmentEdit';
import { useRouter } from 'next/router';
import { client, nextClient } from '@/trpc';

export default configurePage({
  layout: ({ children }) => (
    <Layout title="新しいアパート" prev="/apartment">
      {children}
    </Layout>
  ),
  page: () => {
    const util = nextClient.useContext();
    const router = useRouter();
    const handleSave = async (apartment: ExternalApartment) => {
      client.apartment.create.mutate(apartment);
      router.push('/apartment');
      util.invalidate();
    };
    return <ApartmentEdit onSave={handleSave} />;
  },
});
