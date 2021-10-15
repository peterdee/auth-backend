import { FastifyInstance } from 'fastify';

import log from './log';

export default async function gracefulShutdown(
  signal: string,
  server: FastifyInstance,
  database: any,
): Promise<void> {
  try {
    log(` > shutting down server due to the signal ${signal}`);

    await database.disconnect();
    await server.close();

    return process.exit(0);
  } catch (error) {
    throw new Error(error.message);
  }
}
