import Layout from '@/components/Layout';
import z from 'zod';
import type { Apartment, Room } from '@prisma/client';
import { client, nextClient } from '@/trpc';
import { useRouter } from 'next/router';
import TenantEdit, { TenantEditable } from '@/components/page/TenantEdit';

type Props = {
  apartment: Apartment;
  room: Room;
};

export default function DetailPage() {
  const router = useRouter();
  const query = z.object({ id: z.string() }).parse(router.query);
  const room = nextClient.getRoom.useQuery(query);

  const handleSubmit = async (tenant: TenantEditable) => {
    const roomId = room.data?.id as string; // 常に存在する
    await client.addTenant.mutate({
      ...tenant,
      roomId,
    });
    router.push(`/room/detail/${roomId}`);
  };

  return room.data ? <TenantEdit apartment={room.data.apartment} room={room.data} onSave={handleSubmit} /> : undefined;
}

DetailPage.getLayout = (page: JSX.Element, { room }: Props): JSX.Element => {
  return (
    <Layout title="部屋の入居者追加" prev={`/room/detail/${room.id}`}>
      {page}
    </Layout>
  );
};
