import { Tenant } from '@prisma/client';
import dayjs from 'dayjs';

export type SerializedTenant = Omit<Tenant, 'since' | 'until'> & {
  since: string | null;
  until: string | null;
};

export const deserializeNullDate = (value: string | null): Date | null => {
  return value === null ? null : new Date(value);
};

export const serializeNullDate = (date: Date | null) => {
  return date === null ? null : dayjs(date).format('YYYY-MM-DD');
};

export const serializeTenants = (tenants: Tenant[]) => tenants.map(serializeTenant);

export const serializeTenant = (tenant: Tenant): SerializedTenant => ({
  ...tenant,
  since: serializeNullDate(tenant.since),
  until: serializeNullDate(tenant.until),
});
