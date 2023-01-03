import { ulid } from 'ulid';
import z from 'zod';
import { database } from '../prisma';
import { procedure, router } from './trpc';

const getInput = z.object({
  tenantId: z.string(),
  roomId: z.string(),
});

const createInput = z.object({
  roomId: z.string(),
  name: z.string(),
  since: z.date().nullable(),
  until: z.date().nullable(),
  rent: z.number().int().nullable(),
  waterCharge: z.number().int().nullable(),
  parkingFee: z.number().int().nullable(),
  commonAreaCharge: z.number().int().nullable(),
  admin: z.string(),
});

const updateInput = z.object({
  id: z.string(),
  name: z.string(),
  since: z.date().nullable(),
  until: z.date().nullable(),
  rent: z.number().int().nullable(),
  waterCharge: z.number().int().nullable(),
  parkingFee: z.number().int().nullable(),
  commonAreaCharge: z.number().int().nullable(),
  admin: z.string(),
});

const deleteInput = z.object({
  tenantId: z.string(),
});

const listOccupyingInput = z.object({
  year: z.number(),
  month: z.number(),
  tenantIds: z.array(z.string()).optional(),
});

export const tenant = router({
  get: procedure.input(getInput).query(({ input }) =>
    database.tenant.findFirst({
      where: { id: input.tenantId, roomId: input.roomId },
      include: { room: { include: { apartment: true } } },
      rejectOnNotFound: true,
    }),
  ),
  create: procedure.input(createInput).mutation(async ({ input }) => {
    const data = {
      ...input,
      id: ulid(),
    };
    await database.tenant.create({ data });
  }),
  update: procedure.input(updateInput).mutation(async ({ input }) => {
    const { id, ...inputData } = input;
    const data = {
      ...inputData,
    };
    await database.tenant.update({ where: { id }, data });
  }),
  delete: procedure.input(deleteInput).mutation(async ({ input }) => {
    await database.tenant.delete({ where: { id: input.tenantId } });
  }),

  listOccupying: procedure.input(listOccupyingInput).query(({ input }) => {
    const startOfMonth = new Date(input.year, input.month - 1, 1);
    const endOfMonth = new Date(input.year, input.month, 1);
    const hasIdsCondition = input.tenantIds && input.tenantIds.length > 0 ? [{ id: { in: input.tenantIds } }] : [];
    return database.tenant.findMany({
      where: {
        AND: [
          { OR: [{ since: { equals: null } }, { since: { lte: endOfMonth } }] },
          { OR: [{ until: { equals: null } }, { until: { gt: startOfMonth } }] },
          ...hasIdsCondition,
        ],
      },
      include: {
        room: { include: { apartment: true } },
        invoices: {
          where: { month: startOfMonth },
        },
      },
      orderBy: [
        { room: { apartmentId: 'desc' } },
        { room: { index: 'asc' } },
        { room: { id: 'desc' } },
        { id: 'desc' },
      ],
    });
  }),
});
