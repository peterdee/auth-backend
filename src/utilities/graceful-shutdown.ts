import { FastifyInstance } from 'fastify';

import Database from '../database';
import log from './log';
import { transporter } from './mailer';

export default async function gracefulShutdown(
  signal: string,
  server: FastifyInstance,
  database: typeof Database,
): Promise<void> {
  try {
    log(`-- shutting down due to the signal ${signal}`);

    await database.disconnect(true);
    await server.close();
    transporter.close();

    return process.exit(0);
  } catch (error) {
    throw new Error(error.message);
  }
}
