import { createTRPCProxyClient, OperationLink, TRPCClientError, TRPCLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import { AppRouter } from '../electron-src/trpc';
import { AnyRouter } from '@trpc/server';
import { observable } from '@trpc/server/observable';
// import { TRPCResponse } from '@trpc/server/rpc';

const ipcLink = <TRouter extends AnyRouter>(): TRPCLink<TRouter> => {
  return (runtime): OperationLink<TRouter> => {
    return ({ op }) =>
      observable((observer) => {
        window
          .trpc({ ...op, ctx: {}, input: undefined, rawInput: op.input })
          .then((res: any) => {
            observer.next({
              context: {},
              result: { data: res },
            });
            observer.complete();
          })
          .catch((cause: any) => observer.error(TRPCClientError.from(cause)));

        return () => {};
      });
  };
};

// global.ipcRenderer.send('message', 'hi from next');

export const nextClient = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [ipcLink()],
    };
  },
  ssr: false,
});

export const client = createTRPCProxyClient<AppRouter>({
  links: [ipcLink()],
});
