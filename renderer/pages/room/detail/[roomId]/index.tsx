import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import Layout from '@/components/Layout';
import z from 'zod';
import type { Apartment, Room } from '@prisma/client';
import { Box } from '@mui/material';
import ButtonLink from '@/components/ButtonLink';
import { nextClient } from '@/trpc';
import { useRouter } from 'next/router';
import MyTextField from '@/components/form/TextField';
import FormGroup from '@/components/FromGroup';
import dayjs from 'dayjs';
import { Tenant } from '@/types';
import Container from '@/components/Container';

type Props = {
  apartment: Apartment;
  room: Room;
  tenants: Tenant[];
};

const date = (date: string | Date | null) => {
  if (date === null) return '---';
  return dayjs(date).format('YYYY/MM/DD');
};

function Detail({ apartment, room, tenants }: Props) {
  return (
    <Layout title="部屋の入居状況" prev="/room">
      <Container>
        <Box my="32px">
          <Typography variant="h6">
            {apartment.name} / {room.name}
          </Typography>
        </Box>
        <FormGroup label="入居状況">
          <MyTextField value="入居中" disabled />
        </FormGroup>
        <FormGroup label="入居者">
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>氏名</TableCell>
                  <TableCell>入居日</TableCell>
                  <TableCell>退去日</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tenants.map((tenant) => (
                  <TableRow key={tenant.id}>
                    <TableCell>{tenant.name}</TableCell>
                    <TableCell>{date(tenant.since)}</TableCell>
                    <TableCell>{date(tenant.until)}</TableCell>
                    <TableCell align="right">
                      <ButtonLink href={`/room/detail/${room.id}/edit/${tenant.id}`}>編集</ButtonLink>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </FormGroup>
        <ButtonLink href={`/room/detail/${room.id}/new`}>入居者追加</ButtonLink>
      </Container>
    </Layout>
  );
}
const queryInput = z.object({
  roomId: z.string(),
});

export default function DetailPage() {
  const router = useRouter();
  const query = queryInput.parse(router.query);
  const room = nextClient.room.get.useQuery(query);
  return room.data ? (
    <Detail room={room.data} apartment={room.data.apartment} tenants={room.data.tenants} />
  ) : undefined;
}
