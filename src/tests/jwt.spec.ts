import { expect } from 'chai';

import {
  createToken,
  TokenPayload,
  verifyToken,
} from '../utilities/jwt';

const ID = 'test';
const INVALID_SECRET = 'invalid';
const SECRET = 'test';

describe(
  'JWT module',
  (): void => {
    it(
      'Should create signed token',
      async (): Promise<void> => {
        const token = await createToken({
          id: ID,
          secret: SECRET,
        });
        expect(typeof token).to.be.a('string');
      },
    );
    it(
      'Should verify signed token and get the payload',
      async (): Promise<void> => {
        const token = await createToken({
          id: ID,
          secret: SECRET,
        });

        const { id }: TokenPayload = await verifyToken({
          secret: SECRET,
          token: String(token),
        });
        expect(!!id).to.eq(true);
        expect(id).to.be.equal(ID);
      },
    );
    it(
      'Should not verify token if secret is invalid',
      async (): Promise<void> => {
        try {
          const token = await createToken({
            id: ID,
            secret: SECRET,
          });

          await verifyToken({
            secret: INVALID_SECRET,
            token: String(token),
          });
        } catch (error: any) {
          const { message = '' } = error;
          expect(!!message).to.eq(true);
          expect(message).to.equal('invalid signature');
        }
      },
    );
    it(
      'Should not verify token if it is expired',
      async (): Promise<void> => {
        try {
          const token = await createToken({
            id: ID,
            expiresIn: 1,
            secret: SECRET,
          });

          await new Promise<void>((resolve) => setTimeout(resolve, 1500));

          await verifyToken({
            secret: SECRET,
            token: String(token),
          });
        } catch (error: any) {
          const { message = '' } = error;
          expect(!!message).to.eq(true);
          expect(message).to.equal('jwt expired');
        }
      },
    );
    it(
      'Should not verify token if it is malformed',
      async (): Promise<void> => {
        try {
          const token = await createToken({
            id: ID,
            secret: SECRET,
          });
          const malformed = String(token).substr(2);

          await verifyToken({
            secret: SECRET,
            token: malformed,
          });
        } catch (error: any) {
          const { message = '' } = error;
          expect(!!message).to.eq(true);
          expect(message).to.equal('invalid token');
        }
      },
    );
  },
);
