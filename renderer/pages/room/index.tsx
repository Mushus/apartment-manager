import { Box, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import type { Apartment as OApartment, Room } from '@prisma/client';
import Layout from '@/components/Layout';
import ButtonLink from '@/components/ButtonLink';
import { nextClient } from '@/trpc';

type Apartment = OApartment & {
  rooms: Room[];
};

type Props = {
  apartments: Apartment[];
};

const RoomComponent = ({ apartments }: Props) => {
  return (
    <Container>
      {apartments.map((apartment) => (
        <Box key={apartment.id}>
          <Box>{apartment.name}</Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>部屋名</TableCell>
                  <TableCell>入居状況</TableCell>
                  <TableCell align="right">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {apartment.rooms.map((room) => (
                  <TableRow key={room.id}>
                    <TableCell>{room.name}</TableCell>
                    <TableCell>入居状況</TableCell>
                    <TableCell align="right">
                      <ButtonLink href={`/room/detail/${room.id}`}>編集</ButtonLink>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}
    </Container>
  );
};

export default function RoomPage() {
  const apartments = nextClient.listApartments.useQuery();
  return apartments.data ? <RoomComponent apartments={apartments.data} /> : undefined;
}

RoomPage.getLayout = (page: JSX.Element): JSX.Element => {
  return (
    <Layout title="入居状況" prev="/">
      {page}
    </Layout>
  );
};
