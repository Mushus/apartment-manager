import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import Layout from '@/components/Layout';
import { Apartment } from '@mui/icons-material';
import { useState } from 'react';
import { Box } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { mapValues } from 'lodash';
import { nextClient } from '@/trpc';
import ButtonLink from '@/components/ButtonLink';
import Container from '@/components/Container';
import { configurePage } from '@/components/page/Page';
import Loading from '@/components/page/Loading';

type Apartment = {
  name: string;
};

type Room = {
  name: string;
  apartment: Apartment;
};

type Tenant = {
  id: string;
  room: Room;
  name: string;
};

type Props = {
  tenants: Tenant[];
  defaultChecks: Record<string, boolean>;
};

const InvoiceComponent = ({ tenants, defaultChecks }: Props) => {
  const [checks, setChecks] = useState(defaultChecks);

  const setCheck = (id: string) => {
    setChecks((checks) => ({ ...checks, [id]: Boolean(!checks[id]) }));
  };

  const getCheck = (id: string) => Boolean(checks[id]);

  const checkValues = Object.values(checks);
  const allCheck = checkValues.every((b) => b);
  const lt1Check = checkValues.some((b) => b);
  const someCheck = !allCheck && lt1Check;

  const handleChange = () => {
    if (allCheck || lt1Check) {
      setChecks((checks) => mapValues(checks, () => false));
    } else {
      setChecks((checks) => mapValues(checks, () => true));
    }
  };

  return (
    <Container>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox checked={allCheck} indeterminate={someCheck} onChange={handleChange} />
              </TableCell>
              <TableCell>アパート</TableCell>
              <TableCell>部屋</TableCell>
              <TableCell>契約者</TableCell>
              <TableCell align="right">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant) => (
              <TableRow key={tenant.id}>
                <TableCell padding="checkbox">
                  <Checkbox checked={getCheck(tenant.id)} onChange={() => setCheck(tenant.id)} />
                </TableCell>
                <TableCell>{tenant.room.apartment.name}</TableCell>
                <TableCell>{tenant.room.name}</TableCell>
                <TableCell>{tenant.name}</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box position="fixed" bottom="16px" right="16px">
        <ButtonLink variant="contained" endIcon={<PrintIcon />} href="/invoice/preview">
          印刷
        </ButtonLink>
      </Box>
    </Container>
  );
};

export default configurePage({
  layout: ({ children }) => (
    <Layout title="レシート発行" prev="/">
      {children}
    </Layout>
  ),
  page: () => {
    const { data: tenants } = nextClient.tenant.listOccupying.useQuery({ year: 2022, month: 12 });
    const defaultChecks = tenants ? Object.fromEntries(tenants.map((tenant) => [tenant.id, true])) : undefined;
    return tenants && defaultChecks ? (
      <InvoiceComponent tenants={tenants} defaultChecks={defaultChecks} />
    ) : (
      <Loading />
    );
  },
});
