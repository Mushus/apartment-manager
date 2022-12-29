import { initTRPC } from '@trpc/server';
import { ulid } from 'ulid';
import z from 'zod';
import { deserializeNullDate } from './converter';
import { database } from './prisma';
import { BrowserWindow } from 'electron';

const t = initTRPC.create();

export const appRouter = t.router({
  listApartments: t.procedure.query(() =>
    database.apartment.findMany({
      include: { rooms: true },
    }),
  ),
  getApartment: t.procedure
    .input(
      z.object({
        id: z.string(),
      }),
    )
    .query(({ input }) =>
      database.apartment.findFirst({
        where: { id: input.id },
        include: { rooms: true },
        rejectOnNotFound: true,
      }),
    ),
  createApartments: t.procedure.mutation(() =>
    database.apartment.create({
      data: { id: ulid(), name: '' },
    }),
  ),
  updateApartments: t.procedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        rooms: z.array(
          z.object({
            id: z.string().nullable(),
            name: z.string(),
          }),
        ),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, rooms, ...apartment } = input;
      const updatedApartment = await database.apartment.update({
        where: { id },
        data: {
          ...apartment,
        },
        include: {
          rooms: true,
        },
      });
      const roomsRecord = rooms.map((room) => ({ ...room, apartmentId: updatedApartment.id }));
      const { created, updated, deleted } = makeArrayDiff(updatedApartment.rooms, roomsRecord);
      for (const room of created) {
        await database.room.create({ data: { ...room, id: ulid() } });
      }
      for (const room of updated) {
        await database.room.update({ data: room, where: { id: room.id } });
      }
      for (const ids of deleted) {
        await database.room.deleteMany({ where: { id: { in: ids } } });
      }
    }),
  deleteApartment: t.procedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    await database.room.deleteMany({ where: { apartmentId: input.id } });
    await database.apartment.delete({ where: { id: input.id } });
  }),
  getRoom: t.procedure.input(z.object({ id: z.string() })).query(({ input }) =>
    database.room.findFirst({
      where: { id: input.id },
      include: { apartment: true, tenants: true },
      rejectOnNotFound: true,
    }),
  ),
  getTennant: t.procedure.input(z.object({ tenantId: z.string(), roomId: z.string() })).query(({ input }) =>
    database.tenant.findFirst({
      where: { id: input.tenantId, roomId: input.roomId },
      include: { room: { include: { apartment: true } } },
      rejectOnNotFound: true,
    }),
  ),
  addTenant: t.procedure
    .input(
      z.object({ roomId: z.string(), name: z.string(), since: z.string().nullable(), until: z.string().nullable() }),
    )
    .mutation(async ({ input }) => {
      const data = {
        ...input,
        id: ulid(),
        since: deserializeNullDate(input.since),
        until: deserializeNullDate(input.until),
      };
      await database.tenant.create({ data });
    }),
  editTenant: t.procedure
    .input(z.object({ id: z.string(), name: z.string(), since: z.string().nullable(), until: z.string().nullable() }))
    .mutation(async ({ input }) => {
      const { id, ...inputData } = input;
      const data = {
        ...inputData,
        since: deserializeNullDate(input.since),
        until: deserializeNullDate(input.until),
      };
      await database.tenant.update({ where: { id }, data });
    }),
  deleteTenant: t.procedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    const { id } = input;
    await database.tenant.delete({ where: { id } });
  }),

  getOccupyingTenants: t.procedure.input(z.object({ year: z.number(), month: z.number() })).query(({ input }) => {
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

  showPrintWindow: t.procedure.input(z.object({ tenantIds: z.array(z.string()) })).mutation(async ({}) => {
    const win = new BrowserWindow({ width: 800, height: 1500 });
    win.loadURL('http://github.com');

    // const contents = win.webContents;
  }),
});

export type AppRouter = typeof appRouter;

type WithID = { id: string };
type WithNullID<T> = {
  [K in keyof T]: K extends 'id' ? T[K] | null : T[K];
};

const makeArrayDiff = <T extends WithID>(before: T[], after: WithNullID<T>[]) => {
  const created = after.filter((item) => item.id === null);
  const withId = after.filter((item) => item.id !== null) as T[];
  const afterIdDict = new Map(withId.map((item) => [item.id, item] as const));
  const deleted: string[] = [];
  const updated: T[] = [];
  before.forEach((b) => {
    const item = afterIdDict.get(b.id);
    if (item) {
      updated.push(item);
    } else {
      deleted.push(b.id);
    }
  });

  return { created, updated, deleted };
};
