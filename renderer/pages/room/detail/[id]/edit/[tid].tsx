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

export default function EditPage() {
  const router = useRouter();
  const { id, tid } = z
    .object({
      id: z.string(),
      tid: z.string(),
    })
    .parse(router.query);

  const tenant = nextClient.getTennant.useQuery({ tenantId: tid, roomId: id });

  const handleSubmit = async (data: TenantEditable) => {
    const roomId = tenant.data?.roomId as string; // 常に存在する
    const tenantId = tenant.data?.id as string; // 常に存在する
    await client.editTenant.mutate({
      ...data,
      id: tenantId,
    });
    router.push(`/room/detail/${roomId}`);
  };

  return tenant.data ? (
    <TenantEdit
      apartment={tenant.data.room.apartment}
      room={tenant.data.room}
      tenant={tenant.data}
      onSave={handleSubmit}
    />
  ) : undefined;
}

EditPage.getLayout = (page: JSX.Element, { room }: Props): JSX.Element => {
  return (
    <Layout title="部屋の入居者変種" prev={`/room/detail/${room.id}`}>
      {page}
    </Layout>
  );
};
