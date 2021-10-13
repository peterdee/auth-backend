import { FastifyRequest, FastifyReply } from 'fastify';

import response from '../../utilities/response';

export default async function indexController(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<FastifyReply> {
  return response({
    request,
    reply,
  });
}
