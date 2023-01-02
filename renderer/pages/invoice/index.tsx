import {
  Button,
  Checkbox,
  Input,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import Layout from '@/components/Layout';
import { Apartment } from '@mui/icons-material';
import { ChangeEventHandler, useMemo, useState } from 'react';
import { Box } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { mapValues } from 'lodash';
import { client, nextClient } from '@/trpc';
import Container from '@/components/Container';
import { configurePage } from '@/components/page/Page';
import Loading from '@/components/page/Loading';
import { Tenant as PTenant, Invoice as PInvoice } from '@prisma/client';
import Controls from '@/components/Controls';
import dayjs from 'dayjs';
import SaveIcon from '@mui/icons-material/Save';
import { formToNum } from '@/util';
import { useRouter } from 'next/router';

type Apartment = {
  name: string;
};

type Room = {
  name: string;
  apartment: Apartment;
};

type Tenant = Omit<PTenant, 'roomId' | 'room'> & {
  room: Room;
  invoices: PInvoice[];
};

type ExternalInvoice = Omit<PInvoice, 'id' | 'month'> & {
  id: PInvoice['id'] | null;
};

type Invoice = Omit<PInvoice, 'id' | 'month' | 'waterCharge'> & {
  id: PInvoice['id'] | null;
  waterCharge: string;
};

type Props = {
  tenants: Tenant[];
  defaultChecks: Record<string, boolean>;
  month: string;
  onChangeMonth: (fn: (value: string) => string) => void;
  onSave(invoices: ExternalInvoice[]): void;
  onPrint(invoices: ExternalInvoice[]): void;
};

const InvoiceComponent = ({ tenants, defaultChecks, month, onChangeMonth, onSave, onPrint }: Props) => {
  const [checks, setChecks] = useState(defaultChecks);
  const getCheck = (id: string) => Boolean(checks[id]);

  const defaultInvoice = useMemo<Invoice[]>(
    () =>
      tenants.map((tenant) => {
        const invoice = tenant.invoices[0] ?? undefined;
        return {
          id: invoice?.id ?? null,
          tenantId: tenant.id,
          waterCharge: String(invoice?.waterCharge ?? tenant.waterCharge ?? ''),
        };
      }),
    [tenants, month],
  );
  const [invoices, setInvoices] = useState<Invoice[]>(defaultInvoice);

  const handleChangeWaterCharge =
    (index: number): ChangeEventHandler<HTMLInputElement> =>
    (e) => {
      setInvoices((invoices) => {
        const newInvoices = [...invoices];
        newInvoices[index] = { ...newInvoices[index], waterCharge: e.target.value };
        return newInvoices;
      });
    };

  const setCheck = (id: string) => {
    setChecks((checks) => ({ ...checks, [id]: Boolean(!checks[id]) }));
  };

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

  const handleChangeMonth: ChangeEventHandler<HTMLInputElement> = (e) => {
    onChangeMonth(() => e.target.value);
  };

  const getExportInvoice = () =>
    invoices.map(
      (invoice): ExternalInvoice => ({
        ...invoice,
        waterCharge: formToNum(invoice.waterCharge),
      }),
    );

  const handleSave = () => onSave(getExportInvoice());
  const handlePrint = () => onPrint(getExportInvoice());

  return (
    <Container>
      <Controls>
        <TextField type="month" value={month} onChange={handleChangeMonth} />
      </Controls>
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
              <TableCell>水道料金</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tenants.map((tenant, index) => (
              <TableRow key={tenant.id}>
                <TableCell padding="checkbox">
                  <Checkbox checked={getCheck(tenant.id)} onChange={() => setCheck(tenant.id)} />
                </TableCell>
                <TableCell>{tenant.room.apartment.name}</TableCell>
                <TableCell>{tenant.room.name}</TableCell>
                <TableCell>{tenant.name}</TableCell>
                <TableCell padding="none">
                  <Input value={invoices[index].waterCharge} onChange={handleChangeWaterCharge(index)} />円
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box position="fixed" bottom="16px" right="16px">
        <Button variant="contained" endIcon={<SaveIcon />} onClick={handleSave}>
          保存
        </Button>
        <Button variant="contained" endIcon={<PrintIcon />} onClick={handlePrint}>
          印刷
        </Button>
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
    const router = useRouter();
    const defaultMonth = useMemo(() => dayjs().format('YYYY-MM'), []);
    const [month, setMonth] = useState(defaultMonth);

    const query = useMemo(() => {
      const date = dayjs(month);
      return { year: date.year(), month: date.month() + 1 };
    }, [month]);
    const { data: tenants, isLoading } = nextClient.tenant.listOccupying.useQuery(query);

    const defaultChecks = tenants ? Object.fromEntries(tenants.map((tenant) => [tenant.id, true])) : undefined;

    const handleSave = async (invoices: PInvoice[]) => {
      await client.invoice.update.mutate({ month, invoices });
    };
    const handlePrint = async (invoices: PInvoice[]) => {
      await client.invoice.update.mutate({ month, invoices });
      router.push(`/invoice/preview/${month}`);
    };

    return tenants && defaultChecks && !isLoading ? (
      <InvoiceComponent
        tenants={tenants}
        defaultChecks={defaultChecks}
        month={month}
        onChangeMonth={setMonth}
        key={month}
        onSave={handleSave}
        onPrint={handlePrint}
      />
    ) : (
      <Loading />
    );
  },
});
