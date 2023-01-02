import Layout from '@/components/Layout';
import z from 'zod';
import { client, nextClient } from '@/trpc';
import { useRouter } from 'next/router';
import TenantEdit, { ExternalTenant } from '@/components/page/TenantEdit';
import { configurePage } from '@/components/page/Page';
import Loading from '@/components/page/Loading';

export default configurePage({
  query: z.object({ roomId: z.string() }),
  layout: ({ query, children }) => (
    <Layout title="部屋の入居者追加" prev={query && `/room/detail/${query.roomId}`}>
      {children}
    </Layout>
  ),
  page: ({ query }) => {
    const router = useRouter();
    const { data: room, isLoading } = nextClient.room.get.useQuery(query);

    const handleSubmit = async (tenant: ExternalTenant) => {
      const { roomId } = query;
      await client.tenant.create.mutate({
        ...tenant,
        roomId,
      });
      router.push(`/room/detail/${roomId}`);
    };

    return room && !isLoading ? (
      <TenantEdit apartment={room.apartment} room={room} onSave={handleSubmit} />
    ) : (
      <Loading />
    );
  },
});
