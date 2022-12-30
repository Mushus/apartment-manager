import { Tenant as PTenant } from '@prisma/client';

export type Tenant = Omit<PTenant, 'since' | 'until'> & {
  since: string | null;
  until: string | null;
};

export type DetailTenant = Tenant & {
  occupancyStatus: 'empty' | 'residence';
};
