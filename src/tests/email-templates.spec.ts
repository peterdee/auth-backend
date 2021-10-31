import { expect } from 'chai';

import {
  createAccountRecoveryEmailTemplate,
  EmailTemplate,
} from '../utilities/email-templates';
import generateString from '../utilities/generate-string';

const FIRST_NAME = 'TEST_FIRST_NAME';
const LAST_NAME = 'TEST_LAST_NAME';

describe(
  'Email templates testing',
  (): void => {
    it(
      'Should create an account recovery template',
      (): void => {
        const recoveryLink = `http://localhost:6500/recovery/${generateString(16)}`;
        const template: EmailTemplate = createAccountRecoveryEmailTemplate({
          firstName: FIRST_NAME,
          lastName: LAST_NAME,
          recoveryLink,
        });
        expect(template.message).to.exist;
        expect(template.message.includes(recoveryLink)).to.eq(true);
        expect(template.subject).to.exist;
      },
    );
  },
);
