import { JwtPayload, sign, verify } from 'jsonwebtoken';

import { ACCESS_TOKEN_EXPIRATION } from '../configuration';

export interface TokenPayload extends JwtPayload {
  id?: number | string;
}

interface CreateTokenParams {
  expiresIn?: number;
  id?: number | string;
  secret: string;
}

interface VerifyTokenParams {
  secret: string;
  token: string;
}

export const createToken = async ({
  expiresIn = ACCESS_TOKEN_EXPIRATION,
  id,
  secret,
}: CreateTokenParams): Promise<Error | string> => new Promise(
  (resolve, reject) => sign(
    {
      id,
    },
    secret,
    {
      expiresIn,
    },
    (error, token) => {
      if (error) {
        return reject(error);
      }
      return resolve(token as string);
    }
  ),
);

export const verifyToken = async ({
  secret,
  token,
}: VerifyTokenParams): Promise<Error | TokenPayload> => new Promise(
  (resolve, reject) => verify(
    token,
    secret,
    (error, decoded) => {
      if (error) {
        return reject(error);
      }
      return resolve(decoded as TokenPayload);
    },
  ),
);
