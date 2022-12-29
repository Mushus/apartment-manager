// You can include shared interfaces/types in a separate file
// and then use them in any component by importing them. For
// example, to import the interface below do:
//
// import User from 'path/to/interfaces';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ProcedureCallOptions } from '@trpc/server/dist/core/internals/procedureBuilder';
import { IpcRenderer } from 'electron';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace NodeJS {
    interface Global {
      ipcRenderer: IpcRenderer;
    }
  }

  interface Window {
    trpc: (req: ProcedureCallOptions) => Promise<unknown>;
  }
}
