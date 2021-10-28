import { expect } from 'chai';

import { ADMIN_EMAIL } from '../configuration';
import sendEmail from '../utilities/mailer';

const ADDRESS = ADMIN_EMAIL;
const MESSAGE = 'TEST';
const SUBJECT = 'TEST';

describe(
  'Test mailing service',
  (): void => {
    it(
      'Should send an email',
      async (): Promise<void> => {
        const response = await sendEmail(
          ADDRESS,
          SUBJECT,
          MESSAGE,
        );
        expect(response).to.be.a('string');
      },
    );
  },
);
