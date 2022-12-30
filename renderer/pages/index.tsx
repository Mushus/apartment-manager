import Link from 'next/link';
import Layout from '@/components/Layout';
import { Box, Typography } from '@mui/material';
import Container from '@/components/Container';

function Index() {
  return (
    <Layout>
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
    </Layout>
  );
}

export default Index;
