import { body } from 'express-validator';

export const create = [
  body('name').trim().notEmpty().withMessage('Bus name is required'),
  body('driver').trim().notEmpty().withMessage('Driver name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('plate_number').trim().notEmpty().isLength({ min: 1, max: 10 }).withMessage('Plate number must be between 1 and 10 characters'),
  body('type').trim().notEmpty().withMessage('Bus type is required'),
  body('capacity').isInt({ gt: 0 }).withMessage('Capacity must be a positive integer'),
];