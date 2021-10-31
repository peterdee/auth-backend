import { SERVER_NAME } from '../configuration';

interface AccountRecoveryEmailTemplateOptions {
  firstName: string;
  lastName: string;
  recoveryLink: string;
}

export interface EmailTemplate {
  message: string;
  subject: string;
}

const ACCENT = '#22AA55';
const BACKGROUND = '#FFFFFF';
const TEXT = '#191919';

export function createAccountRecoveryEmailTemplate(
  options: AccountRecoveryEmailTemplateOptions,
): EmailTemplate {
  return {
    message: `
<div style="background-color: ${BACKGROUND}; padding: 16px;">
  <h2 style="color: ${ACCENT};">
    ${SERVER_NAME}: Account Recovery
  </h2>
  <div style="color: ${TEXT};">
    <div>
      Hi, ${options.firstName} ${options.lastName}!
    </div>
    <div>
      This email was sent to you because you initiated account recovery.
    </div>
    <div>
      Please click on the link below to set your new password:
    </div>
    <div style="margin-top: 16px;">
      <a href="${options.recoveryLink}" style="color: ${ACCENT};">
        ${options.recoveryLink}
      </a>
    </div>
  </div>
</div>
    `,
    subject: `${SERVER_NAME}: Account Recovery`,
  };
}
