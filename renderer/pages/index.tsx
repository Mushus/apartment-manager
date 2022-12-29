import Link from 'next/link';
import Layout from '@/components/Layout';
import { Container } from '@mui/system';
import { Box, Typography } from '@mui/material';

function Index() {
  return (
    <Container>
      <Typography variant="h6" mt="32px">
        入居者管理
      </Typography>
      <Box my="16px">
        <Box my="8px">
          <Link href="/room">部屋状況</Link>
        </Box>
        <Box my="8px">
          <Link href="/invoice">レシート発行</Link>
        </Box>
      </Box>
      <Typography variant="h6" mt="32px">
        マスタ管理
      </Typography>
      <Box my="16px">
        <Box my="8px">
          <Link href="/apartment">アパート管理</Link>
        </Box>
      </Box>
    </Container>
  );
}

Index.getLayout = (page: JSX.Element): JSX.Element => {
  return <Layout>{page}</Layout>;
};

export default Index;
