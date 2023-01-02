import { Button } from '@mui/material';
import Layout from '@/components/Layout';
import { Box } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { nextClient } from '@/trpc';
import styles from '@/styles/Preview.module.scss';
import classNames from 'classnames';
import { configurePage } from '@/components/page/Page';
import Loading from '@/components/page/Loading';
import z from 'zod';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Tenant as PTenant, Invoice, Room as PRoom, Apartment } from '@prisma/client';

type Room = PRoom & {
  apartment: Apartment;
};

type Tenant = PTenant & {
  room: Room;
  invoices: Invoice[];
};

type Props = {
  tenants: Tenant[];
  defaultChecks: Record<string, boolean>;
};

const InvoiceComponent = ({ tenants }: Props) => {
  const handlePrint = () => {
    window.print();
  };

  const administrator = '管理人';

  const now = useMemo(() => dayjs(), []);
  const year = String(now.year());
  const month = ('00' + (now.month() + 1)).slice(-2);
  const date = ('00' + now.date()).slice(-2);
  return (
    <>
      <div className={styles.pages}>
        {tenants.map((tenant) => {
          const room = tenant.room;
          const apartment = room.apartment;
          const invoice = tenant.invoices?.[0];
          const rent = room.rent ?? apartment.rent ?? 0;
          const waterCharge = invoice.waterCharge ?? room.waterCharge ?? apartment.waterCharge ?? 0;
          const parkingFee = room.parkingFee ?? room.parkingFee ?? apartment.parkingFee ?? 0;
          const commonAreaCharge = room.commonAreaCharge ?? room.commonAreaCharge ?? apartment.commonAreaCharge ?? 0;

          const sum = Number(rent) + Number(waterCharge) + Number(parkingFee) + Number(commonAreaCharge);
          const receipt = (
            <>
              <div className={classNames(styles.tenantName, styles.GaTanantName)}>{tenant.name} 様</div>
              <div className={classNames(styles.publishAt, styles.GaPublishAt)}>
                発行日: {year} 年 {month} 月 {date} 日
              </div>
              <table className={classNames(styles.chargeTable, styles.GaTable)}>
                <thead>
                  <tr>
                    <th>項目名</th>
                    <th>金額（税込）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>家賃</td>
                    <td className={styles.charge}>{(+rent).toLocaleString()} 円</td>
                  </tr>
                  <tr>
                    <td>水道料金</td>
                    <td className={styles.charge}>{(+waterCharge).toLocaleString()} 円</td>
                  </tr>
                  <tr>
                    <td>駐車場料金</td>
                    <td className={styles.charge}>{(+parkingFee).toLocaleString()} 円</td>
                  </tr>
                  <tr>
                    <td>共益費</td>
                    <td className={styles.charge}>{(+commonAreaCharge).toLocaleString()} 円</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td>計</td>
                    <td className={styles.charge}>{(+sum).toLocaleString()} 円</td>
                  </tr>
                </tfoot>
              </table>
              <div className={classNames(styles.admin, styles.GaAdmin)}>{administrator}</div>
            </>
          );
          return (
            <div className={styles.page} key={tenant.id}>
              <article className={styles.paper}>
                <section className={styles.receipt}>
                  <h1 className={classNames(styles.header, styles.GaHeader)}>家賃請求(控え)</h1>
                  {receipt}
                </section>
                <section className={styles.certificate}>
                  <h1 className={classNames(styles.header, styles.GaHeader)}>入金証</h1>
                  <div className={classNames(styles.tenantName, styles.GaTenantName)}>{tenant.name} 様</div>
                  <div className={classNames(styles.publishAt, styles.GaPublishAt)}>
                    発行日: {year} 年 {month} 月 {date} 日
                  </div>
                  <div className={classNames(styles.charge, styles.charge)}>
                    金額 <strong>{sum.toLocaleString()} 円</strong> を頂きました。
                  </div>
                  <div className={classNames(styles.admin, styles.GaAdmin)}>{administrator}</div>
                </section>
                <section className={styles.receipt}>
                  <h1 className={classNames(styles.header, styles.GaHeader)}>家賃請求</h1>
                  {receipt}
                </section>
              </article>
            </div>
          );
        })}
      </div>
      <Box position="fixed" bottom="16px" right="16px" className={styles.unPrint}>
        <Button variant="contained" endIcon={<PrintIcon />} onClick={handlePrint}>
          印刷
        </Button>
      </Box>
    </>
  );
};

export default configurePage({
  query: z.object({ month: z.string() }),
  layout: ({ children }) => (
    <Layout title="プレビュー" prev="/invoice">
      {children}
    </Layout>
  ),
  page: ({ query }) => {
    const params = useMemo(() => {
      const date = dayjs(query.month);
      return { year: date.year(), month: date.month() + 1 };
    }, []);
    const { data: tenants, isLoading } = nextClient.tenant.listOccupying.useQuery(params);
    const defaultChecks = tenants ? Object.fromEntries(tenants.map((tenant) => [tenant.id, true])) : undefined;
    return tenants && defaultChecks && !isLoading ? (
      <InvoiceComponent tenants={tenants} defaultChecks={defaultChecks} />
    ) : (
      <Loading />
    );
  },
});