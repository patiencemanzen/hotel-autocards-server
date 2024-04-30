import { body } from 'express-validator';

export const create = [
  body('name').trim().notEmpty().withMessage('Organization Name is required'),
  body('description').trim().notEmpty().withMessage('Project description is required'),
];

export const update = [
  body('name').trim().notEmpty().withMessage('Organization Name is required'),
  body('description').trim().notEmpty().withMessage('Project description is required'),
];