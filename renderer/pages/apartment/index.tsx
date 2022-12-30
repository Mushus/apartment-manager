import Layout from '@/components/Layout';
import { nextClient, client } from '@/trpc';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ButtonLink from '@/components/ButtonLink';
import Container from '@/components/Container';

type Apartment = {
  id: string;
  name: string;
};

type Props = {
  apartments: Apartment[];
};

function Index({ apartments }: Props) {
  const router = useRouter();
  const handleCreate = useCallback(async () => {
    const apartment = await client.apartment.create.mutate();
    router.push(`/apartment/edit/${apartment.id}`);
  }, []);

  return (
    <Layout title="アパート一覧" prev="/">
      <Container>
        <Button onClick={handleCreate}>追加</Button>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>アパート名</TableCell>
                <TableCell align="right">操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {apartments.map((apartment) => (
                <TableRow key={apartment.id}>
                  <TableCell>{apartment.name}</TableCell>
                  <TableCell align="right">
                    <ButtonLink href={`/apartment/edit/${apartment.id}`}>編集</ButtonLink>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </Layout>
  );
}

export default function IndexPage() {
  const apartments = nextClient.apartment.list.useQuery();
  return apartments.data ? <Index apartments={apartments.data} /> : undefined;
}
