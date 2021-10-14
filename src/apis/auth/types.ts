import { RequestGenericInterface } from 'fastify';

export interface SignInRequest extends RequestGenericInterface {
  Body: {
    email?: string;
    password?: string;
  };
}

export interface SignUpRequest extends RequestGenericInterface {
  Body: {
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
  };
}
