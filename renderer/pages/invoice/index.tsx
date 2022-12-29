import {
  Button,
  Checkbox,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Layout from '@/components/Layout';
import { Apartment } from '@mui/icons-material';
import { useState } from 'react';
import { Box } from '@mui/system';
import PrintIcon from '@mui/icons-material/Print';
import { mapValues } from 'lodash';
import { client, nextClient } from '@/trpc';

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

  const handlePrint = () => {
    client.showPrintWindow.mutate({ tenantIds: [] });
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
        <Button variant="contained" endIcon={<PrintIcon />} onClick={handlePrint}>
          印刷
        </Button>
      </Box>
    </Container>
  );
};

export default function InvoicePage() {
  const tenants = nextClient.getOccupyingTenants.useQuery({ year: 2022, month: 12 });
  const defaultChecks = tenants.data ? Object.fromEntries(tenants.data.map((tenant) => [tenant.id, true])) : undefined;
  return tenants.data && defaultChecks ? (
    <InvoiceComponent tenants={tenants.data} defaultChecks={defaultChecks} />
  ) : undefined;
}

InvoicePage.getLayout = (page: JSX.Element): JSX.Element => {
  return (
    <Layout title="レシート発行" prev="/">
      {page}
    </Layout>
  );
};
