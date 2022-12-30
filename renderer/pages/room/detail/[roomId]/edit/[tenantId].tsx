import Layout from '@/components/Layout';
import z from 'zod';
import type { Apartment, Room, Tenant as OTenant } from '@prisma/client';
import { client, nextClient } from '@/trpc';
import { useRouter } from 'next/router';
import TenantEdit, { TenantEditable } from '@/components/page/TenantEdit';

type Tenant = Omit<OTenant, 'since' | 'until'> & { since: string | null; until: string | null };

type Props = {
  apartment: Apartment;
  room: Room;
  tenant: Tenant;
};

const queryInput = z.object({
  roomId: z.string(),
  tenantId: z.string(),
});

export default function EditPage() {
  const router = useRouter();
  const query = queryInput.parse(router.query);

  const tenant = nextClient.tenant.get.useQuery(query);

  const handleSubmit = async (data: TenantEditable) => {
    const roomId = tenant.data?.roomId as string; // 常に存在する
    const tenantId = tenant.data?.id as string; // 常に存在する
    await client.tenant.update.mutate({
      ...data,
      id: tenantId,
    });
    router.push(`/room/detail/${roomId}`);
  };

  return tenant.data ? (
    <Layout title="部屋の入居者変種" prev={`/room/detail/${tenant.data.room.id}`}>
      <TenantEdit
        apartment={tenant.data.room.apartment}
        room={tenant.data.room}
        tenant={tenant.data}
        onSave={handleSubmit}
      />
    </Layout>
  ) : undefined;
}
