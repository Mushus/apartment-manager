import z from 'zod';
import { procedure, router } from './trpc';
import { database } from '../prisma';

const getInput = z.object({ roomId: z.string() });

export const room = router({
  get: procedure.input(getInput).query(({ input }) =>
    database.room.findFirst({
      where: { id: input.roomId },
      include: { apartment: true, tenants: true },
      rejectOnNotFound: true,
    }),
  ),
});
