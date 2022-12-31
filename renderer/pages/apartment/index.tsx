import Layout from '@/components/Layout';
import { nextClient, client } from '@/trpc';
import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import ButtonLink from '@/components/ButtonLink';
import Container from '@/components/Container';
import { usePrompt } from '@/components/Prompt';
import { configurePage } from '@/components/page/Page';
import Loading from '@/components/page/Loading';

type Apartment = {
  id: string;
  name: string;
};

type Props = {
  apartments: Apartment[];
};

function Index({ apartments }: Props) {
  const util = nextClient.useContext();
  const router = useRouter();

  const handleCreate = useCallback(async () => {
    const apartment = await client.apartment.create.mutate();
  }, []);

  const [prompt, promptComponent] = usePrompt();

  const handleDelete = async (apartment: Apartment) => {
    if (await prompt({ text: `アパート「${apartment.name}」を削除しますか？` })) {
      await client.apartment.delete.mutate({ apartmentId: apartment.id });
      util.apartment.list.invalidate();
    }
  };

  return (
    <Container>
      <Button onClick={handleCreate}>追加</Button>
      <TableContainer>
        <Table style={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell>アパート名</TableCell>
              <TableCell width="150px">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {apartments.map((apartment) => (
              <TableRow key={apartment.id}>
                <TableCell>{apartment.name}</TableCell>
                <TableCell style={{ width: 'max-content' }}>
                  <Button variant="contained" color="warning" onClick={() => handleDelete(apartment)}>
                    削除
                  </Button>
                  <ButtonLink href={`/apartment/edit/${apartment.id}`}>編集</ButtonLink>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {promptComponent}
    </Container>
  );
}

export default configurePage({
  layout: ({ children }) => (
    <Layout title="アパート一覧" prev="/">
      {children}
    </Layout>
  ),
  page: () => {
    const { data: apartments } = nextClient.apartment.list.useQuery();
    return apartments ? <Index apartments={apartments} /> : <Loading />;
  },
});
