import { FastifyInstance } from 'fastify';

import indexController from './index.controller';

export default async function router(instance: FastifyInstance): Promise<void> {
  instance.get('/', indexController);
  instance.get('/api', indexController);
}
