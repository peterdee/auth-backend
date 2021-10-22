import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

import database from '../database';

let mongod = null;

module.exports = {
  mochaHooks: {
    async afterAll() {
      await database.disconnect(true);
      await mongod.stop();
    },
    async beforeAll() {
      mongod = await MongoMemoryServer.create();
      await database.connect(mongod.getUri());
    },
  },
};
