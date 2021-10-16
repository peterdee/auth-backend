import { FastifyInstance, FastifyPluginOptions } from 'fastify';

import store from '../store';

export default async function delay(
  _: FastifyInstance,
  __: FastifyPluginOptions,
  done: (error?: Error) => void,
) {
  console.log('delay');
  store.enterWith({
    id: null,
    incoming: Date.now(),
  });

  return done();
}
