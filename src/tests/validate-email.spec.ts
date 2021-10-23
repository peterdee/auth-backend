import { expect } from 'chai';

import validateEmail from '../utilities/validate-email';

const INVALID_EMAIL_ONE = 'test'
const INVALID_EMAIL_TWO = 'test@email'
const VALID_EMAIL = 'test@email.com';

describe(
  'Test email validation',
  (): void => {
    it(
      'Should validate email address',
      (): void => {
        expect(validateEmail(INVALID_EMAIL_ONE)).to.eq(false);
        expect(validateEmail(INVALID_EMAIL_TWO)).to.eq(false);
        expect(validateEmail(VALID_EMAIL)).to.eq(true);
      },
    );
  },
);
