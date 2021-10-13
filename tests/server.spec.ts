import dotenv from 'dotenv';
dotenv.config();

import buildServer from '../src/server';

describe(
  'Server launching',
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

        expect(responseIndex.statusCode).toBe(200);
        expect(responseAPI.statusCode).toBe(200);
      },
    );
  },
);
