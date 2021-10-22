import { expect } from 'chai';

import buildServer from '../server';

describe(
  'Test server launching',
  (): void => {
    it(
      'Should launch the server',
      async (): Promise<void> => {
        const server = await buildServer();
        const [responseIndex, responseAPI] = await Promise.all([
          server.inject({
            method: 'GET',
            url: '/',
          }),
          server.inject({
            method: 'GET',
            url: '/api',
          }),
        ]);

        await server.close();

        expect(responseIndex.statusCode).to.equal(200);
        expect(responseAPI.statusCode).to.equal(200);
      },
    );
  },
);
