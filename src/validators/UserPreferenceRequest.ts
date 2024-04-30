import { body } from 'express-validator';

export const storeUserPreferencesRequest = [
  body('Address')
    .isObject()
    .withMessage('Address must be a valid JSON object')
    .custom((value) => {
      const { street, city, state, postalCode } = value;

      if (!street || !city || !state || !postalCode)
        throw new Error('Invalid address format');

      return true;
    }),
];
