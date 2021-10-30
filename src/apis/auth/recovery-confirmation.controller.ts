import { FastifyRequest, FastifyReply } from 'fastify';

import {
  RECOVERY_CODE_TYPES,
  RESPONSE_MESSAGES,
  RESPONSE_STATUSES,
} from '../../configuration';
import { ConfirmRecoveryRequest } from './types';
import { RecoveryCode, User } from '../../database';
import response from '../../utilities/response';
import sendEmail from '../../utilities/mailer';
import service from './auth.service';

export default async function confirmRecovery(
  request: FastifyRequest<ConfirmRecoveryRequest>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const { body: { code = '', password = '' } = {} } = request;
    if (!(code && password)) {
      return response({
        info: RESPONSE_MESSAGES.missingData,
        reply,
        request,
        status: RESPONSE_STATUSES.badRequest,
      });
    }

    const processedCode = code.trim();
    const processedPassword = password.trim();
    if (!(processedCode && processedPassword)) {
      return response({
        info: RESPONSE_MESSAGES.missingData,
        reply,
        request,
        status: RESPONSE_STATUSES.badRequest,
      });
    }

    return response({
      request,
      reply,
    });
  } catch (error) {
    return response({
      error,
      info: RESPONSE_MESSAGES.internalServerError,
      reply,
      request,
      status: RESPONSE_STATUSES.internalServerError,
    });
  }
}
