import { useRouter } from 'next/router';
import { FC, ReactNode } from 'react';
import z from 'zod';

type Config<Query extends z.ZodType | never> = {
  query?: Query;
  layout: FC<{
    query: (Query extends z.ZodType ? z.infer<Query> : never) | undefined;
    children?: ReactNode;
  }>;
  page: FC<{ query: Query extends z.ZodType ? z.infer<Query> : never }>;
};

export const configurePage =
  <Query extends z.ZodType | never>(config: Config<Query>) =>
  () => {
    const Layout = config.layout;
    const Page = config.page;

    let queryData: z.infer<Query> = undefined;
    if (config.query) {
      const { query, isReady } = useRouter();
      if (!isReady) return <Layout query={undefined} />;
      queryData = config.query.parse(query);
    }

    return (
      <Layout query={queryData}>
        <Page query={queryData} />
      </Layout>
    );
  };
