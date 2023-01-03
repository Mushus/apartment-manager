// import isDev from 'electron-is-dev';
import { PrismaClient } from '@prisma/client';

const url = process.argv[1];
const datasources =
  url !== undefined && url.startsWith('file://')
    ? {
        db: {
          url,
        },
      }
    : undefined;

export const database = new PrismaClient({
  datasources,
});
