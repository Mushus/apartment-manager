import Layout from '@/components/Layout';
import z from 'zod';
import { client, nextClient } from '@/trpc';
import { useRouter } from 'next/router';
import TenantEdit, { TenantEditable } from '@/components/page/TenantEdit';

const queryInput = z.object({ roomId: z.string() });

export default function DetailPage() {
  const router = useRouter();
  const query = queryInput.parse(router.query);
  const room = nextClient.room.get.useQuery(query);

  const handleSubmit = async (tenant: TenantEditable) => {
    const roomId = room.data?.id as string; // 常に存在する
    await client.tenant.create.mutate({
      ...tenant,
      roomId,
    });
    router.push(`/room/detail/${roomId}`);
  };

  return room.data ? (
    <Layout title="部屋の入居者追加" prev={`/room/detail/${room.data.id}`}>
      <TenantEdit apartment={room.data.apartment} room={room.data} onSave={handleSubmit} />
    </Layout>
  ) : undefined;
}
