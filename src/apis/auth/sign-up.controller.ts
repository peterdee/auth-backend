import { FastifyRequest, FastifyReply } from 'fastify';

import generateString from '../../utilities/generate-string';
import { Password, User, UserSecret } from '../../database';
import response from '../../utilities/response';
import { RESPONSE_MESSAGES, RESPONSE_STATUSES } from '../../configuration';
import service from './auth.service';
import { SignUpRequest } from './types';

export default async function signInController(
  request: FastifyRequest<SignUpRequest>,
  reply: FastifyReply,
): Promise<FastifyReply> {
  try {
    const {
      body: {
        email = '',
        firstName = '',
        lastName = '',
        password = '',
      } = {},
    } = request;
    if (!(email && firstName && lastName && password)) {
      return response({
        info: RESPONSE_MESSAGES.missingData,
        reply,
        request,
        status: RESPONSE_STATUSES.badRequest,
      });
    }

    const processedEmail = email.trim().toLowerCase();
    const processedFirstName = firstName.trim().toLowerCase();
    const processedLastName = lastName.trim().toLowerCase();
    const processedPassword = password.trim();

    const existingRecord = await service.getRecordByField<User>('User', 'email', processedEmail);
    if (existingRecord) {
      return response({
        info: RESPONSE_MESSAGES.emailAlreadyInUse,
        reply,
        request,
        status: RESPONSE_STATUSES.conflict,
      });
    }

    const idField = '_id';

    const [userRecord, hash, secret] = await Promise.all([
      service.createRecord<User>(
        'User',
        {
          email: processedEmail,
          firstName: processedFirstName,
          lastName: processedLastName,
        },
      ),
      service.createHash(processedPassword),
      service.createHash(`${processedEmail}-${generateString(32)}-${Date.now()}`),
    ]);

    const result: [UserSecret, Password] = await Promise.all([
      service.createRecord<UserSecret>(
        'UserSecret',
        {
          secret,
          userId: userRecord[idField],
        },
      ),
      service.createRecord<Password>(
        'Password',
        {
          hash,
          userId: userRecord[idField],
        },
      ),
    ]);

    const [secretRecord] = result;

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
