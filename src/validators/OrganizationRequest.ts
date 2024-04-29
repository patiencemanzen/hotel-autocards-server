import { body } from 'express-validator';

export const create = [
  body('name').trim().notEmpty().withMessage('Organization Name is required'),
];

export const update = [
  body('name').trim().notEmpty().withMessage('Organization Name is required'),
];