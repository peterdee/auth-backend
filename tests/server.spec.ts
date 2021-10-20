// import dotenv from 'dotenv';
// dotenv.config();

// import buildServer from '../src/server';
// import database from '../src/database';

// describe(
//   'Server launching',
//   (): void => {
//     afterAll(
//       async () => {
//         console.log('run after');
//         await database.disconnect();
//       },
//     );

//     beforeAll(
//       async () => {
//         console.log('run before');
//         await database.connect();
//       },
//     );

//     it(
//       'Should launch the server',
//       async (): Promise<void> => {
//         const server = await buildServer();
//         const [responseIndex, responseAPI] = await Promise.all([
//           server.inject({
//             method: 'GET',
//             url: '/',
//           }),
//           server.inject({
//             method: 'GET',
//             url: '/api',
//           }),
//         ]);

//         await database.disconnect();
//         expect(responseIndex.statusCode).toBe(200);
//         expect(responseAPI.statusCode).toBe(200);
//       },
//     );
//   },
// );
