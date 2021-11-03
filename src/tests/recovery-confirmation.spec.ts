import { expect } from 'chai';
import { LightMyRequestResponse } from 'fastify';

import {
  ADMIN_EMAIL,
  RESPONSE_MESSAGES,
} from '../configuration';
import buildServer from '../server';

const url = '/api/auth/recovery';

describe(
  'Test Auth controllers: confirm recovery code and set new password',
  (): void => {
    it(
      'Should return 404 error if code or password are missing',
      async (): Promise<void> => {
        const server = await buildServer();
        const response: LightMyRequestResponse = await server.inject({
          method: 'POST',
          payload: {

          },
          url,
        });
        await server.close();

        expect(response.statusCode).to.eq(404);
      },
    );
  },
);
