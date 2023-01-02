import { ulid } from 'ulid';
import z from 'zod';
import { database } from '../prisma';
import { procedure, router } from './trpc';
import dayjs from 'dayjs';

const updateInput = z.object({
  month: z.string(),
  invoices: z.array(
    z.object({
      id: z.string().nullable(),
      tenantId: z.string(),
      waterCharge: z.number().nullable(),
    }),
  ),
});

export const invoice = router({
  update: procedure.input(updateInput).mutation(async ({ input }) => {
    const month = dayjs(input.month).toDate();
    const invoices = input.invoices;

    for (const invoice of invoices) {
      if (invoice.id == null) {
        await database.invoice.create({ data: { ...invoice, month, id: ulid() } });
      } else {
        await database.invoice.updateMany({
          where: { id: invoice.id, month, tenantId: invoice.tenantId },
          data: { waterCharge: invoice.waterCharge },
        });
      }
    }
  }),
});
