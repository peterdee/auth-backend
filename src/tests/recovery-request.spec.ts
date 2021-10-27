import { expect } from 'chai';
import { LightMyRequestResponse } from 'fastify';

import {
  ADMIN_EMAIL,
  RESPONSE_MESSAGES,
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
    // it(
    //   'Should sign user in',
    //   async (): Promise<void> => {
    //     const server = await buildServer();
    //     const response: LightMyRequestResponse = await server.inject({
    //       method: 'POST',
    //       payload: {
    //         email: ADMIN_EMAIL,
    //         password: ADMIN_PASSWORD,
    //       },
    //       url,
    //     });

    //     await server.close();

    //     expect(response.statusCode).to.equal(200);

    //     const responseJSON = response.json();
    //     expect(responseJSON.info).to.eq(RESPONSE_MESSAGES.ok);
    //     expect(responseJSON.request).to.eq(`${url} [POST]`);

    //     const data: ResponseData = responseJSON.data;
    //     expect(data.tokens.access).to.exist;
    //     expect(data.tokens.refresh).to.exist;
    //     expect(data.user.role).to.eq(ROLES.admin);
    //   },
    // );
  },
);
