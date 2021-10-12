import bodyParser from 'fastify-formbody';
import cors from 'fastify-cors';
import fastify from 'fastify';
import favicon from 'fastify-favicon';
import helmet from 'fastify-helmet';

async function buildServer() {
  const server = fastify({
    logger: true,
  });

  await server.register(bodyParser);
  await server.register(cors);
  await server.register(
    favicon,
    {
      name: 'favicon.ico',
      path: './assets',
    },
  );
  await server.register(helmet);

  server.get('/', (_, reply) => {
    reply.send({ info: 'OK' });
  });

  return server;
}

export default buildServer;
