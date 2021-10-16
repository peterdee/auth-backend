import bodyParser from 'fastify-formbody';
import cors from 'fastify-cors';
import fastify from 'fastify';
import favicon from 'fastify-favicon';
import helmet from 'fastify-helmet';

import authRouter from './apis/auth';
import database from './database';
import delay from './middlewares/delay';
import { ENV, ENVS } from './configuration';
import indexRouter from './apis/index';
import gracefulShutdown from './utilities/graceful-shutdown';

async function buildServer() {
  const server = fastify({
    logger: {
      prettyPrint: ENV === ENVS.development,
    },
  });

  await database.connect();

  await server.register(delay);
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

  return server;
}

export default buildServer;
