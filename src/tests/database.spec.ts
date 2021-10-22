import { expect } from 'chai';

import { ADMIN_EMAIL, ROLES } from '../configuration';
import database from '../database';
import seeding from '../database/seeding';

describe(
  'Test the database',
  (): void => {
    it(
      'Should connect',
      async (): Promise<void> => {
        const connection = await database.getConnection();
        expect(connection).to.be.not.null;
        expect(connection.readyState).to.equal(1);
      },
    );
    it(
      'Should seed the data',
      async (): Promise<void> => {
        await seeding(database);
        const userRecord = await database.UserCollection.findOne({
          email: ADMIN_EMAIL,
          role: ROLES.admin,
        });
        expect(!!userRecord).to.equal(true);

        const idField = '_id';
        const [passwordRecord, userSecretRecord] = await Promise.all([
          database.PasswordCollection.findOne({
            userId: userRecord[idField],
          }),
          database.UserSecretCollection.findOne({
            userId: userRecord[idField],
          }),
        ]);
        expect(!!passwordRecord).to.equal(true);
        expect(!!userSecretRecord).to.equal(true);
      }
    )
  },
);
