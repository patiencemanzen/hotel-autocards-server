import { body } from 'express-validator';

export const create = [
  body('name').trim().notEmpty().withMessage('Data-type Name is required'),
  body('description').trim().notEmpty().withMessage('Data-type description is required'),
];

export const update = [
  body('name').trim().notEmpty().withMessage('Data-type Name is required'),
  body('description').trim().notEmpty().withMessage('Data-type description is required'),
];