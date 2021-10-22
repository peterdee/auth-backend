import { FastifyReply, FastifyRequest } from 'fastify';

import {
  ENV,
  ENVS,
  RESPONSE_MESSAGES,
  RESPONSE_STATUSES,
} from '../configuration';
import log from './log';
import store from '../store';

interface ResponseParams {
  data?: any;
  error?: Error | null;
  info?: string;
  reply: FastifyReply;
  request: FastifyRequest;
  status?: number;
}

interface ResponseObject {
  data?: any;
  datetime: number;
  delay: number;
  info: string;
  request: string;
  status: number;
  uptime: number;
}

export default function createResponse({
  data,
  error = null,
  info = RESPONSE_MESSAGES.ok,
  reply,
  request,
  status = RESPONSE_STATUSES.ok,
}: ResponseParams): FastifyReply {
  const responseObject: ResponseObject = {
    datetime: Date.now(),
    delay: Date.now() - store.getStore().incoming,
    info,
    request: `${request.url} [${request.method}]`,
    status,
    uptime: Math.floor(process.uptime()),
  };

  if (data) {
    responseObject.data = data;
  }

  if (error && ENV === ENVS.development) {
    log(
      `-- ${RESPONSE_MESSAGES.internalServerError}\n${typeof error === 'object'
        ? JSON.stringify(error)
        : error}`,
    );
  }

  return reply.code(status).send(responseObject);
}
