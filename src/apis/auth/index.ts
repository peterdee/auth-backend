import { FastifyInstance } from 'fastify';

import {
  GetRecoveryRequest,
  SignInRequest,
  SignUpRequest,
} from './types';

import getRecovery from './recovery-request.controller';
import signInController from './sign-in.controller';
import signUpController from './sign-up.controller';

export default async function router(instance: FastifyInstance): Promise<void> {
  instance.get<GetRecoveryRequest>('/api/auth/recovery/:email', getRecovery);
  instance.post<SignInRequest>('/api/auth/sign-in', signInController);
  instance.post<SignUpRequest>('/api/auth/sign-up', signUpController);
}
