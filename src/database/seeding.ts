import { hash } from 'scryptwrap';

import { ADMIN_EMAIL, ADMIN_PASSWORD, ROLES } from '../configuration';
import database, { User } from './index';
import log from '../utilities/log';

export default async function seeding(): Promise<Error | void> {
  try {
    const existing = await database.UserModel.findOne({
      email: ADMIN_EMAIL,
    });
    if (existing) {
      return log('-- seeding is not required');
    }

    const now = Date.now();
    const userRecord: User = await database.UserModel.create({
      created: now,
      email: ADMIN_EMAIL,
      firstName: 'Admin',
      lastName: 'Admin',
      role: ROLES.admin,
      updated: now,
    });

    const idField = '_id';
    const [passwordHash, secret] = await Promise.all([
      hash(ADMIN_PASSWORD),
      hash(`${userRecord[idField]}-${now}`),
    ]);

    await Promise.all([
      database.PasswordModel.create({
        created: now,
        hash: passwordHash,
        updated: now,
        userId: userRecord[idField],
      }),
      database.PasswordModel.create({
        created: now,
        secret,
        updated: now,
        userId: userRecord[idField],
      }),
    ]);

    return log('-- seeding done');
  } catch (error) {
    throw new Error(error.message);
  }
}
