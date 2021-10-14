import generateString from '../src/utilities/generate-string';

describe(
  'Test string generating',
  (): void => {
    it(
      'Should generate a random string',
      (): void => {
        const defaultLength = generateString();
        expect(defaultLength.length).toBe(16);

        const specifiedLength = generateString(8);
        expect(specifiedLength.length).toBe(8);
      },
    );
  },
);
