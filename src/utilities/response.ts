import { FastifyReply, FastifyRequest } from 'fastify';
// import { RESPONSE_MESSAGES, RESPONSE_STATUSES } from '../configuration/index.js';

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
}

export default function createResponse({
  data,
  info = 'OK',
  reply,
  request,
  status = 200,
}: ResponseParams): FastifyReply {
  const responseObject: ResponseObject = {
    datetime: Date.now(),
    info,
    request: `${request.url} [${request.method}]`,
    status,
  };

  if (data) {
    responseObject.data = data;
  }

  return reply.code(status).send(responseObject);
}
