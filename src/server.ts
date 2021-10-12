import bodyParser from 'fastify-formbody';
import cors from 'fastify-cors';
import fastify from 'fastify';
import favicon from 'fastify-favicon';
import helmet from 'fastify-helmet';

import { ENV, ENVS } from './configuration';

async function buildServer() {
  const server = fastify({
    logger: {
      prettyPrint: ENV === ENVS.development,
    },
  });

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

  server.get('/', (_, reply) => {
    reply.send({ info: 'OK' });
  });

  return server;
}

export default buildServer;
