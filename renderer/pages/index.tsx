import Link from 'next/link';
import Layout from '@/components/Layout';
import { Box } from '@mui/material';
import Container from '@/components/Container';
import Section from '@/components/Section';

function Index() {
  return (
    <Layout>
      <Container>
        <Section title="入居者管理">
          <Box my="8px">
            <Link href="/room">入居状況変更</Link>
          </Box>
          <Box my="8px">
            <Link href="/invoice">レシート発行</Link>
          </Box>
        </Section>

        <Section title="マスタ管理">
          <Box my="8px">
            <Link href="/apartment">物件編集</Link>
          </Box>
        </Section>
      </Container>
    </Layout>
  );
}

export default Index;
