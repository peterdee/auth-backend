import { createTransport } from 'nodemailer';

// eslint-disable-next-line
import { createTransport as createMockTransport } from 'nodemailer-mock';

import log from './log';
import {
  MAILER_SERVICE_EMAIL,
  MAILER_SERVICE_PASSWORD,
  TESTING,
} from '../configuration';

const transportConfiguration = {
  auth: {
    pass: MAILER_SERVICE_PASSWORD,
    user: MAILER_SERVICE_EMAIL,
  },
  host: 'smtp.gmail.com',
};

const transport = (options: typeof transportConfiguration) => {
  log(`-- mailing service connected${TESTING === 'true' ? ' [MOCKED]' : ''}`);
  if (TESTING === 'true') {
    return createMockTransport(options);
  }
  return createTransport(options);
};

export const transporter = transport(transportConfiguration);

export default async function sendEmail(
  address = '',
  subject = '',
  message = '',
): Promise<null | string | void> {
  if (!(address && message && subject)) {
    return null;
  }
  const options = {
    from: MAILER_SERVICE_EMAIL,
    to: address,
    subject,
    html: message,
  };
  try {
    const { response } = await transporter.sendMail(options);
    log(`-- mailing service: sent to ${address} (${response})`);
    return response;
  } catch (err) {
    return log(`-- mailing service: error\n${err}\nOptions: ${JSON.stringify(options)}`);
  }
}
