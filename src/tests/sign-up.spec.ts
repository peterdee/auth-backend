import { expect } from 'chai';
import { LightMyRequestResponse } from 'fastify';

import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  RESPONSE_MESSAGES,
  ROLES,
} from '../configuration';
import buildServer from '../server';
import { User } from '../database';

interface ResponseData {
  tokens: {
    access: string;
    refresh: string;
  };
  user: User;
}

const url = '/api/auth/sign-up';

describe(
  'Test Auth controllers: sign up',
  (): void => {
    it(
      'Should return a "MISSING_DATA" error',
      async (): Promise<void> => {
        const server = await buildServer();
        const response: LightMyRequestResponse = await server.inject({
          method: 'POST',
          payload: {
            email: ADMIN_EMAIL,
          },
          url,
        });

        await server.close();

        expect(response.statusCode).to.equal(400);

        const responseJSON = response.json();
        expect(responseJSON.info).to.eq(RESPONSE_MESSAGES.missingData);
        expect(responseJSON.request).to.eq(`${url} [POST]`);
      },
    );
    it(
      'Should return an "INVALID_DATA" error',
      async (): Promise<void> => {
        const server = await buildServer();
        const response: LightMyRequestResponse = await server.inject({
          method: 'POST',
          payload: {
            email: 'invalid',
            firstName: 'Test',
            lastName: 'Test',
            password: ADMIN_PASSWORD,
          },
          url,
        });

        await server.close();

        expect(response.statusCode).to.equal(400);

        const responseJSON = response.json();
        expect(responseJSON.info).to.eq(RESPONSE_MESSAGES.invalidData);
        expect(responseJSON.request).to.eq(`${url} [POST]`);
      },
    );
    it(
      'Should return an "EMAIL_ALREADY_IN_USE" error',
      async (): Promise<void> => {
        const server = await buildServer();
        const response: LightMyRequestResponse = await server.inject({
          method: 'POST',
          payload: {
            email: ADMIN_EMAIL,
            firstName: 'Test',
            lastName: 'Test',
            password: 'test',
          },
          url,
        });

        await server.close();

        expect(response.statusCode).to.equal(409);

        const responseJSON = response.json();
        expect(responseJSON.info).to.eq(RESPONSE_MESSAGES.emailAlreadyInUse);
        expect(responseJSON.request).to.eq(`${url} [POST]`);
      },
    );
    it(
      'Should sign user up',
      async (): Promise<void> => {
        const server = await buildServer();
        const response: LightMyRequestResponse = await server.inject({
          method: 'POST',
          payload: {
            email: `test-${ADMIN_EMAIL}`,
            firstName: 'Test',
            lastName: 'Test',
            password: 'test',
          },
          url,
        });

        await server.close();

        expect(response.statusCode).to.equal(200);

        const responseJSON = response.json();
        expect(responseJSON.info).to.eq(RESPONSE_MESSAGES.ok);
        expect(responseJSON.request).to.eq(`${url} [POST]`);

        const data: ResponseData = responseJSON.data;
        expect(data.tokens.access).to.exist;
        expect(data.tokens.refresh).to.exist;
        expect(data.user.role).to.eq(ROLES.user);
      },
    );
  },
);
