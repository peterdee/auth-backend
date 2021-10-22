import { expect } from 'chai';

import { ADMIN_EMAIL, ADMIN_PASSWORD, RESPONSE_MESSAGES } from '../configuration';
import buildServer from '../server';

describe(
  'Test Auth controllers',
  (): void => {
    it(
      'Should sign user in',
      async (): Promise<void> => {
        const server = await buildServer();
        const url = '/api/auth/sign-in';
        const response: any = await server.inject({
          method: 'POST',
          payload: {
            email: ADMIN_EMAIL,
            password: ADMIN_PASSWORD,
          },
          url,
        });

        await server.close();

        expect(response.statusCode).to.equal(200);

        const responseJSON = response.json();
        expect(responseJSON.info).to.eq(RESPONSE_MESSAGES.ok);
        expect(responseJSON.request).to.eq(`${url} [POST]`);

        // const { data: { tokens: TokenPayload, user } = {} } = responseJSON;
        // expect(tokens).to.contain('access');
      },
    );
  },
);
