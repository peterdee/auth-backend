import { expect } from 'chai';

import generateString from '../utilities/generate-string';

describe(
  'Random string generator',
  (): void => {
    it(
      'Should generate a random string',
      (): void => {
        const defaultLength = generateString();
        expect(defaultLength.length).to.eq(16);

        const specifiedLength = generateString(8);
        expect(specifiedLength.length).to.eq(8);
      },
    );
  },
);
