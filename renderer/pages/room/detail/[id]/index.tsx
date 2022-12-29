import { Container, Typography } from '@mui/material';
import Layout from '@/components/Layout';
import z from 'zod';
import type { Apartment, Room } from '@prisma/client';
import { Box } from '@mui/system';
import ButtonLink from '@/components/ButtonLink';
import { nextClient } from '@/trpc';
import { useRouter } from 'next/router';

type Props = {
  apartment: Apartment;
  room: Room;
};

function Detail({ apartment, room }: Props) {
  return (
    <Container>
      <Box my="32px">
        <Typography variant="h6">
          {apartment.name} / {room.name}
        </Typography>
      </Box>
      <Box mb="16px">
        <Typography>部屋状況</Typography>
        <Typography variant="h6">入居中</Typography>
      </Box>
      <ButtonLink href={`/room/detail/${room.id}/new`}>入居者追加</ButtonLink>
    </Container>
  );
}

export default function DetailPage() {
  const router = useRouter();
  const query = z
    .object({
      id: z.string(),
    })
    .parse(router.query);

  const room = nextClient.getRoom.useQuery(query);
  return room.data ? <Detail room={room.data} apartment={room.data.apartment} /> : undefined;
}

DetailPage.getLayout = (page: JSX.Element): JSX.Element => {
  return (
    <Layout title="部屋の入居状況" prev="/room">
      {page}
    </Layout>
  );
};
