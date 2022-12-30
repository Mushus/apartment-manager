import { apartment } from './apartment';
import { room } from './room';
import { tenant } from './tenant';
import { router } from './trpc';

export const appRouter = router({
  apartment,
  room,
  tenant,
});

export type AppRouter = typeof appRouter;
