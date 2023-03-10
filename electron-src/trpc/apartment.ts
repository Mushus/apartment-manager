import z from 'zod';
import { ulid } from 'ulid';
import { database } from '../prisma';
import { procedure, router } from './trpc';
import { makeArrayDiff } from '../util';

const getInput = z.object({
  apartmentId: z.string(),
});

const createInput = z.object({
  name: z.string(),
  rooms: z.array(
    z.object({
      name: z.string(),
      rent: z.number().int().nullable(),
      waterCharge: z.number().int().nullable(),
      parkingFee: z.number().int().nullable(),
      commonAreaCharge: z.number().int().nullable(),
      admin: z.string(),
    }),
  ),
  rent: z.number().int().nullable(),
  waterCharge: z.number().int().nullable(),
  parkingFee: z.number().int().nullable(),
  commonAreaCharge: z.number().int().nullable(),
  admin: z.string(),
});

const updateInput = z.object({
  id: z.string(),
  name: z.string(),
  rooms: z.array(
    z.object({
      id: z.string().nullable(),
      name: z.string(),
      rent: z.number().int().nullable(),
      waterCharge: z.number().int().nullable(),
      parkingFee: z.number().int().nullable(),
      commonAreaCharge: z.number().int().nullable(),
      admin: z.string(),
    }),
  ),
  rent: z.number().int().nullable(),
  waterCharge: z.number().int().nullable(),
  parkingFee: z.number().int().nullable(),
  commonAreaCharge: z.number().int().nullable(),
  admin: z.string(),
});

const deleteInput = z.object({ apartmentId: z.string() });

export const apartment = router({
  list: procedure.query(() =>
    database.apartment.findMany({
      include: { rooms: { orderBy: { index: 'asc' } } },
    }),
  ),
  get: procedure.input(getInput).query(({ input }) =>
    database.apartment.findFirst({
      where: { id: input.apartmentId },
      include: {
        rooms: {
          orderBy: { index: 'asc' },
        },
      },
      rejectOnNotFound: true,
    }),
  ),
  create: procedure.input(createInput).mutation(({ input }) =>
    database.apartment.create({
      data: {
        id: ulid(),
        ...input,
        rooms: {
          create: input.rooms.map((room, index) => ({
            ...room,
            id: ulid(),
            index,
          })),
        },
      },
    }),
  ),
  update: procedure.input(updateInput).mutation(async ({ input }) => {
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
    const roomsRecord = rooms.map((room, index) => ({ ...room, apartmentId: updatedApartment.id, index }));
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
  delete: procedure.input(deleteInput).mutation(async ({ input }) => {
    await database.room.deleteMany({ where: { apartmentId: input.apartmentId } });
    await database.apartment.delete({ where: { id: input.apartmentId } });
  }),
});
