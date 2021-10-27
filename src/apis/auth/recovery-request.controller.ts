import { FastifyRequest, FastifyReply } from 'fastify';

import generateString from '../../utilities/generate-string';
import { GetRecoveryRequest } from './types';
import { RecoveryCode, User } from '../../database';
import {
  RECOVERY_CODE_TYPES,
  RESPONSE_MESSAGES,
  RESPONSE_STATUSES,
} from '../../configuration';
import response from '../../utilities/response';
import service from './auth.service';

export default async function getRecovery(
  request: FastifyRequest<GetRecoveryRequest>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const { params: { email = '' } = {} } = request;
    if (!(email && email.trim())) {
      return response({
        info: RESPONSE_MESSAGES.missingData,
        reply,
        request,
        status: RESPONSE_STATUSES.badRequest,
      });
    }

    const processedEmail = email.trim();
    const userRecord = await service.getRecordByField<User>('User', 'email', processedEmail);
    if (!userRecord) {
      return response({
        info: RESPONSE_MESSAGES.accessDenied,
        reply,
        request,
        status: RESPONSE_STATUSES.unauthorized,
      });
    }

    const idField = '_id';
    await service.deleteRecordByQuery(
      'RecoveryCode',
      {
        type: RECOVERY_CODE_TYPES.account,
        userId: userRecord[idField],
      },
    );

    const code = `${userRecord[idField]}${generateString(16)}`;
    await service.createRecord<RecoveryCode>(
      'RecoveryCode',
      {
        code,
        type: RECOVERY_CODE_TYPES.account,
        userId: userRecord[idField],
      },
    );

    // TODO: send code to the user

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
