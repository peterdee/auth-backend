import { expect } from 'chai';

import { ADMIN_EMAIL, ROLES } from '../configuration';
import database, { User, UserSecret } from '../database';
import seeding from '../database/seeding';
import service from '../apis/auth/auth.service';

const TEST_EMAIL = 'test-services@email.com';
const TEST_FIRST_NAME = 'Test';
const TEST_LAST_NAME = 'Test';
const TEST_PASSWORD = 'test';

describe(
  'Test Auth services',
  (): void => {
    before(async () => {
      await seeding(database);
    });

    it(
      'Should create and compare hashes',
      async (): Promise<void> => {
        const hashed = await service.createHash(TEST_PASSWORD);
        expect(hashed).to.exist;

        const isValid = await service.compareHashes(TEST_PASSWORD, hashed);
        expect(isValid).to.eq(true);

        const notValid = await service.compareHashes(`${TEST_PASSWORD}x`, hashed);
        expect(notValid).to.eq(false);

        try {
          await service.compareHashes(TEST_PASSWORD, `${hashed}123`);
        } catch (error) {
          expect(error.message).to.eq('Hash string is invalid!');
        }
      },
    );
    it(
      'Should create and get database records',
      async (): Promise<void> => {
        await service.createRecord<User>(
          'User',
          {
            email: TEST_EMAIL,
            firstName: TEST_FIRST_NAME,
            lastName: TEST_LAST_NAME,
            role: ROLES.user,
          },
        );

        const result = await service.getRecordByField(
          'User',
          'email',
          TEST_EMAIL,
        );
        expect(result).to.exist;

        try {
          await service.createRecord<User>(
            'User',
            {
              email: TEST_EMAIL,
              firstName: TEST_FIRST_NAME,
              lastName: TEST_LAST_NAME,
              role: ROLES.user,
            },
          );
        } catch (error) {
          expect(error.message.includes('duplicate key')).to.eq(true);
        }
      },
    );
    it(
      'Should delete database records',
      async (): Promise<void> => {
        await service.deleteRecordByQuery(
          'User',
          {
            email: TEST_EMAIL,
            role: ROLES.user,
          },
        );

        const result = await service.getRecordByField(
          'User',
          'email',
          TEST_EMAIL,
        );
        expect(result).to.not.exist;
      },
    );
    it(
      'Should create token pair',
      async (): Promise<void> => {
        const admin = await service.getRecordByField<User>(
          'User',
          'email',
          ADMIN_EMAIL,
        );

        const idField = '_id';
        const secret = await service.getRecordByField<UserSecret>(
          'UserSecret',
          'userId',
          admin[idField],
        );

        const [access, refresh] = await service.createTokenPair(
          secret.secret,
          admin[idField],
        );

        expect(typeof access).to.eq('string');
        expect(typeof refresh).to.eq('string');
      },
    );
  },
);
