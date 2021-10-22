import { FastifyRequest, FastifyReply } from 'fastify';

import { Password, User, UserSecret } from '../../database';
import response from '../../utilities/response';
import { RESPONSE_MESSAGES, RESPONSE_STATUSES } from '../../configuration';
import service from './auth.service';
import { SignInRequest } from './types';

export default async function signInController(
  request: FastifyRequest<SignInRequest>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const { body: { email = '', password = '' } = {} } = request;
    if (!(email && password)) {
      return response({
        info: RESPONSE_MESSAGES.missingData,
        reply,
        request,
        status: RESPONSE_STATUSES.badRequest,
      });
    }

    const processedEmail = email.trim().toLowerCase();
    const processedPassword = password.trim();

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

    const result: [Password, UserSecret] = await Promise.all([
      service.getRecordByField<Password>('Password', 'userId', userRecord[idField]),
      service.getRecordByField<UserSecret>('UserSecret', 'userId', userRecord[idField]),
    ]);
    if (!(result[0] && result[1])) {
      return response({
        info: RESPONSE_MESSAGES.accessDenied,
        reply,
        request,
        status: RESPONSE_STATUSES.unauthorized,
      });
    }

    const [passwordRecord, secretRecord] = result;

    const isValid = await service.compareHashes(processedPassword, passwordRecord.hash);
    if (!isValid) {
      return response({
        info: RESPONSE_MESSAGES.accessDenied,
        reply,
        request,
        status: RESPONSE_STATUSES.unauthorized,
      });
    }

    const [access, refresh] = await service.createTokenPair(
      secretRecord.secret,
      userRecord[idField],
    );

    return response({
      data: {
        tokens: {
          access,
          refresh,
        },
        user: userRecord,
      },
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
