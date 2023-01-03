// import isDev from 'electron-is-dev';
import { PrismaClient } from '@prisma/client';
import argv from 'argv';

const { targets } = argv.run();
const url = targets[0];
console.log(url);
const datasources =
  url !== undefined
    ? {
        db: {
          url,
        },
      }
    : undefined;

export const database = new PrismaClient({
  datasources,
});
