import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('trpc', (req: unknown) => ipcRenderer.invoke('trpc', req));
