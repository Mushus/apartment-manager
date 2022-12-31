import Layout from '@/components/Layout';
import z from 'zod';
import { client, nextClient } from '@/trpc';
import { useRouter } from 'next/router';
import TenantEdit, { TenantEditable } from '@/components/page/TenantEdit';
import { configurePage } from '@/components/page/Page';
import Loading from '@/components/page/Loading';

export default configurePage({
  query: z.object({
    roomId: z.string(),
    tenantId: z.string(),
  }),
  layout: ({ query, children }) => (
    <Layout title="部屋の入居者変種" prev={query ? `/room/detail/${query.roomId}` : undefined}>
      {children}
    </Layout>
  ),
  page: ({ query }) => {
    const { data: tenant } = nextClient.tenant.get.useQuery(query);

    const handleSubmit = async (data: TenantEditable) => {
      const router = useRouter();
      const { roomId, tenantId } = query;
      await client.tenant.update.mutate({
        ...data,
        id: tenantId,
      });
      router.push(`/room/detail/${roomId}`);
    };

    return tenant ? (
      <TenantEdit apartment={tenant.room.apartment} room={tenant.room} tenant={tenant} onSave={handleSubmit} />
    ) : (
      <Loading />
    );
  },
});
