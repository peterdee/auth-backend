import { FastifyReply, FastifyRequest } from 'fastify';

import { RESPONSE_MESSAGES, RESPONSE_STATUSES } from '../configuration';

interface ResponseParams {
  data?: any;
  info?: string;
  reply: FastifyReply;
  request: FastifyRequest;
  status?: number;
}

interface ResponseObject {
  data?: any;
  datetime: number;
  info: string;
  request: string;
  status: number;
  uptime: number;
}

export default function createResponse({
  data,
  info = RESPONSE_MESSAGES.ok,
  reply,
  request,
  status = RESPONSE_STATUSES.ok,
}: ResponseParams): FastifyReply {
  const responseObject: ResponseObject = {
    datetime: Date.now(),
    info,
    request: `${request.url} [${request.method}]`,
    status,
    uptime: Math.floor(process.uptime()),
  };

  if (data) {
    responseObject.data = data;
  }

  return reply.code(status).send(responseObject);
}