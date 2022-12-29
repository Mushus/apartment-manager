// Native
import { join } from 'path';
import { format } from 'url';

// Packages
import { BrowserWindow, app, ipcMain } from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';
import { appRouter } from './trpc';
import { callProcedure } from '@trpc/server';
import { ProcedureCallOptions } from '@trpc/server/dist/core/internals/procedureBuilder';

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  const port = 8000;

  await prepareNext('./renderer', port);

  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js'),
    },
  });

  const url = isDev
    ? `http://localhost:${port}/`
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

ipcMain.handle('trpc', async (_, req: ProcedureCallOptions) => {
  try {
    console.log(req);
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
