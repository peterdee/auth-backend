import { hash } from 'scryptwrap';

import { ADMIN_EMAIL, ADMIN_PASSWORD, ROLES } from '../configuration';
import Database from './index';
import log from '../utilities/log';

export default async function seeding(database: typeof Database): Promise<Error | void> {
  try {
    const existing = await database.UserCollection.findOne({
      email: ADMIN_EMAIL,
    });
    if (existing) {
      return log('-- seeding is not required');
    }

    const now = Date.now();
    const userRecord = await database.UserCollection.create({
      email: ADMIN_EMAIL,
      firstName: 'Admin',
      lastName: 'Admin',
      role: ROLES.admin,
    });

    const idField = '_id';
    const [passwordHash, secret] = await Promise.all([
      hash(ADMIN_PASSWORD),
      hash(`${userRecord[idField]}-${now}`),
    ]);

    await Promise.all([
      database.PasswordCollection.create({
        hash: passwordHash,
        userId: userRecord[idField],
      }),
      database.UserSecretCollection.create({
        secret,
        userId: userRecord[idField],
      }),
    ]);

    return log('-- seeding done');
  } catch (error) {
    throw new Error(error.message);
  }
}
