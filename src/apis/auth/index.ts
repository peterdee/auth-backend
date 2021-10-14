import { FastifyInstance } from 'fastify';

import { SignInRequest, SignUpRequest } from './types';

import signInController from './sign-in.controller';
import signUpController from './sign-up.controller';

export default async function router(instance: FastifyInstance): Promise<void> {
  instance.post<SignInRequest>('/api/auth/sign-in', signInController);
  instance.post<SignUpRequest>('/api/auth/sign-up', signUpController);
}
