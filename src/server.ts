import bodyParser from 'fastify-formbody';
import cors from 'fastify-cors';
import fastify from 'fastify';
import favicon from 'fastify-favicon';
import helmet from 'fastify-helmet';

import authRouter from './apis/auth';
import database from './database';
import {
  DATABASE_CONNECTION_STRING,
  ENV,
  ENVS,
  TESTING,
} from './configuration';
import delay from './hooks/delay';
import indexRouter from './apis/index';
import gracefulShutdown from './utilities/graceful-shutdown';
import seeding from './database/seeding';

async function buildServer() {
  const server = fastify({
    logger: TESTING !== 'true'
      ? {
        prettyPrint: ENV === ENVS.development,
      }
      : false,
  });

  server.addHook('onRequest', delay);

  await database.connect(DATABASE_CONNECTION_STRING);
  await seeding(database);

  await server.register(bodyParser);
  await server.register(cors);
  await server.register(
    favicon,
    {
      name: 'favicon.ico',
      path: './src/assets',
    },
  );
  await server.register(helmet);

  await server.register(authRouter);
  await server.register(indexRouter);

  if (TESTING !== 'true') {
    process.on(
      'SIGINT',
      (signal: string): Promise<void> => gracefulShutdown(
        signal,
        server,
        database,
      ),
    );
    process.on(
      'SIGTERM',
      (signal: string): Promise<void> => gracefulShutdown(
        signal,
        server,
        database,
      ),
    );
  }

  return server;
}

export default buildServer;
