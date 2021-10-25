import { expect } from 'chai';

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

        const data: ResponseData = responseJSON.data;
        expect(data.tokens.access).to.exist;
        expect(data.tokens.refresh).to.exist;
        expect(data.user.role).to.eq(ROLES.admin);
      },
    );
  },
);
