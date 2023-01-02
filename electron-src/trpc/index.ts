import { apartment } from './apartment';
import { room } from './room';
import { tenant } from './tenant';
import { invoice } from './invoice';
import { router } from './trpc';

export const appRouter = router({
  apartment,
  room,
  tenant,
  invoice,
});

export type AppRouter = typeof appRouter;
