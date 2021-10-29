import { expect } from 'chai';
import { LightMyRequestResponse } from 'fastify';

import {
  ADMIN_EMAIL,
  RESPONSE_MESSAGES,
} from '../configuration';
import buildServer from '../server';

const url = '/api/auth/recovery';

describe(
  'Test Auth controllers: request recovery code',
  (): void => {
    it(
      'Should return 404 error if email parameter is missing',
      async (): Promise<void> => {
        const server = await buildServer();
        const response: LightMyRequestResponse = await server.inject({
          method: 'GET',
          url,
        });
        await server.close();

        expect(response.statusCode).to.eq(404);
      },
    );
    it(
      'Should return an "ACCESS_DENIED" error',
      async (): Promise<void> => {
        const server = await buildServer();
        const response: LightMyRequestResponse = await server.inject({
          method: 'GET',
          url: `${url}/${ADMIN_EMAIL}x`,
        });

        await server.close();

        expect(response.statusCode).to.equal(401);

        const responseJSON = response.json();
        expect(responseJSON.info).to.eq(RESPONSE_MESSAGES.accessDenied);
        expect(responseJSON.request).to.eq(`${url}/${ADMIN_EMAIL}x [GET]`);
      },
    );
    it(
      'Should get a 200 response',
      async (): Promise<void> => {
        const server = await buildServer();
        const response: LightMyRequestResponse = await server.inject({
          method: 'GET',
          url: `${url}/${ADMIN_EMAIL}`,
        });

        await server.close();

        expect(response.statusCode).to.equal(200);

        const responseJSON = response.json();
        expect(responseJSON.info).to.eq(RESPONSE_MESSAGES.ok);
        expect(responseJSON.request).to.eq(`${url}/${ADMIN_EMAIL} [GET]`);
      },
    );
  },
);
