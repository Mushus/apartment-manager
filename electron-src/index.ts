// Native
import { join } from 'path';

// Packages
import { BrowserWindow, app, ipcMain } from 'electron';
import prepareNext from 'electron-next';
import { appRouter } from './trpc';
import { callProcedure } from '@trpc/server';
import { ProcedureCallOptions } from '@trpc/server/dist/core/internals/procedureBuilder';
import { createUrl, port } from './util';

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  await prepareNext('./renderer', port);

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  });

  const url = createUrl(port);
  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

ipcMain.handle('trpc', async (_, req: ProcedureCallOptions) => {
  try {
    const res = await callProcedure({
      ...req,
      procedures: appRouter._def.procedures,
    });
    return res;
  } catch (e) {
    console.error(e);
    throw e;
  }
});
