import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config();

import database from '../database';
import seeding  from '../database/seeding';

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
      await seeding(database);
    },
  },
};
