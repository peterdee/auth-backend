import { compare, hash } from 'scryptwrap';

import { createToken } from '../../utilities/jwt';
import database from '../../database';
import { REFRESH_TOKEN_EXPIRATION } from '../../configuration';

export default {
  compareHashes: async (
    plaintext: string,
    hashed: string,
  ): Promise<boolean> => compare(plaintext, hashed),
  createHash: async (plaintext: string): Promise<string> => hash(plaintext),
  createRecord: async <T>(
    collection: string,
    data: any,
  ): Promise<T> => database[`${collection}Model`].create({
    ...data,
    created: Date.now(),
    updated: Date.now(),
  }),
  createTokenPair: async (
    secret: string,
    userId: string,
  ): Promise<[Error | string, Error | string]> => Promise.all([
    createToken({
      id: userId,
      secret,
    }),
    createToken({
      expiresIn: REFRESH_TOKEN_EXPIRATION,
      id: userId,
      secret,
    }),
  ]),
  getRecordByField: async <T>(
    collection: string,
    field: string,
    value: any,
  ): Promise<T> => database[`${collection}Model`].findOne({
    [field]: value,
  }),
};
