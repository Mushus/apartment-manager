import { Button } from '@mui/material';
import Layout from '@/components/Layout';
import { Apartment } from '@mui/icons-material';
import { Box } from '@mui/material';
import PrintIcon from '@mui/icons-material/Print';
import { nextClient } from '@/trpc';
import styles from '@/styles/Preview.module.scss';
import classNames from 'classnames';

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

const InvoiceComponent = ({ tenants }: Props) => {
  const handlePrint = () => {
    window.print();
  };

  const administrator = '管理人';

  const year = '2022';
  const month = '01';
  const date = '01';

  const rent = 1000;
  const waterCharge = 1000;
  const parkingFee = 2000;
  const commonAreaCharge = 5000;

  const sum = Number(rent) + Number(waterCharge) + Number(parkingFee) + Number(commonAreaCharge);
  return (
    <Layout title="プレビュー" prev="/invoice">
      <div className={styles.pages}>
        {tenants.map((tenant) => {
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
                    発行日: 　　　　 年 　　 月 　　 日
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
    </Layout>
  );
};

export default function InvoicePage() {
  const tenants = nextClient.tenant.listOccupying.useQuery({ year: 2022, month: 12 });
  const defaultChecks = tenants.data ? Object.fromEntries(tenants.data.map((tenant) => [tenant.id, true])) : undefined;
  return tenants.data && defaultChecks ? (
    <InvoiceComponent tenants={tenants.data} defaultChecks={defaultChecks} />
  ) : undefined;
}
