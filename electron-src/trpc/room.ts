import z from 'zod';
import { procedure, router } from './trpc';
import { database } from '../prisma';
import dayjs from 'dayjs';

const getInput = z.object({ roomId: z.string() });

export const room = router({
  get: procedure.input(getInput).query(({ input }) =>
    database.room
      .findFirst({
        where: { id: input.roomId },
        include: { apartment: true, tenants: true },
        rejectOnNotFound: true,
      })
      .then((room) => {
        const today = dayjs(dayjs().format('YYYY-MM-DD')).toDate();
        const tenants = room.tenants.map((tenant) => ({
          ...tenant,
          isResidence:
            (tenant.since === null || tenant.since <= today) && (tenant.until === null || tenant.until >= today),
        }));
        const occupancyStatus = tenants.some((tenant) => tenant.isResidence) ? 'residence' : 'empty';
        return { ...room, occupancyStatus, tenants };
      }),
  ),
  list: procedure.query(() => {
    const today = dayjs(dayjs().format('YYYY-MM-DD')).toDate();
    return database.apartment
      .findMany({
        include: {
          rooms: {
            include: {
              tenants: {
                where: {
                  AND: [
                    { OR: [{ since: { equals: null } }, { since: { lte: today } }] },
                    { OR: [{ until: { equals: null } }, { until: { gte: today } }] },
                  ],
                },
              },
            },
            orderBy: { index: 'asc' },
          },
        },
      })
      .then((apartments) =>
        apartments.map((apartment) => ({
          ...apartment,
          rooms: apartment.rooms.map((room) => ({
            ...room,
            occupancyStatus: room.tenants.length > 0 ? 'residence' : 'empty',
          })),
        })),
      );
  }),
});
