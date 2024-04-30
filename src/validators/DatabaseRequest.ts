import { body } from 'express-validator';

export const create = [
  body('name').trim().notEmpty().withMessage('Database Name is required'),
  body('description').trim().notEmpty().withMessage('Database description is required'),
];

export const update = [
  body('name').trim().notEmpty().withMessage('Database Name is required'),
  body('description').trim().notEmpty().withMessage('Database description is required'),
];