import { body } from 'express-validator';

export const create = [
  body('name').trim().notEmpty().withMessage('Bus name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('lisence').trim().notEmpty().isLength({ min: 1, max: 20 }).withMessage('lisence number must be between 1 and 10 characters'),
];