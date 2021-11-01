import { FastifyRequest, FastifyReply } from 'fastify';

import { ConfirmRecoveryRequest } from './types';
import generateString from '../../utilities/generate-string';
import {
  RECOVERY_CODE_TYPES,
  RESPONSE_MESSAGES,
  RESPONSE_STATUSES,
} from '../../configuration';
import { Password, RecoveryCode, User, UserSecret } from '../../database';
import response from '../../utilities/response';
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

    const existingCode = await service.getRecordByQuery<RecoveryCode>(
      'RecoveryCode',
      {
        code,
        recoveryType: RECOVERY_CODE_TYPES.account,
      },
    );
    if (!existingCode) {
      return response({
        info: RESPONSE_MESSAGES.invalidRecoveryCode,
        reply,
        request,
        status: RESPONSE_STATUSES.badRequest,
      });
    }

    const [newHash, newSecret] = await Promise.all([
      service.createHash(password),
      service.createHash(`${existingCode.userId}-${generateString(32)}-${Date.now()}`),
    ]);

    await Promise.all([
      service.updateRecordByQuery<Password>(
        'Password',
        {
          hash: newHash,
          updated: Date.now(),
        },
      ),
      service.updateRecordByQuery<UserSecret>(
        'UserSecret',
        {
          hash: newHash,
          updated: Date.now(),
        },
      ),
    ]);

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