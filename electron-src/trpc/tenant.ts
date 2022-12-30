import { ulid } from 'ulid';
import z from 'zod';
import { deserializeNullDate } from '../converter';
import { database } from '../prisma';
import { procedure, router } from './trpc';

const getInput = z.object({
  tenantId: z.string(),
  roomId: z.string(),
});

const createInput = z.object({
  roomId: z.string(),
  name: z.string(),
  since: z.string().nullable(),
  until: z.string().nullable(),
});

const updateInput = z.object({
  id: z.string(),
  name: z.string(),
  since: z.string().nullable(),
  until: z.string().nullable(),
});

const deleteInput = z.object({
  tenantId: z.string(),
});

const listOccupyingInput = z.object({
  year: z.number(),
  month: z.number(),
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
      since: deserializeNullDate(input.since),
      until: deserializeNullDate(input.until),
    };
    await database.tenant.create({ data });
  }),
  update: procedure.input(updateInput).mutation(async ({ input }) => {
    const { id, ...inputData } = input;
    const data = {
      ...inputData,
      since: deserializeNullDate(input.since),
      until: deserializeNullDate(input.until),
    };
    await database.tenant.update({ where: { id }, data });
  }),
  delete: procedure.input(deleteInput).mutation(async ({ input }) => {
    await database.tenant.delete({ where: { id: input.tenantId } });
  }),

  listOccupying: procedure.input(listOccupyingInput).query(({ input }) => {
    const startOfMonth = new Date(input.year, input.month - 1, 1);
    const endOfMonth = new Date(input.year, input.month - 1, 1);
    return database.tenant.findMany({
      where: {
        AND: [
          { OR: [{ since: { equals: null } }, { since: { lte: endOfMonth } }] },
          { OR: [{ until: { equals: null } }, { until: { gte: startOfMonth } }] },
        ],
      },
      include: { room: { include: { apartment: true } } },
      orderBy: [{ room: { apartmentId: 'desc' } }, { room: { id: 'desc' } }, { id: 'desc' }],
    });
  }),
});
