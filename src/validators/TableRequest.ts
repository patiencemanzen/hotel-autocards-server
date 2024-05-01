import { body } from 'express-validator';

export const create = [
  body('name').trim().notEmpty().withMessage('Table Name is required'),
  body('description').trim().notEmpty().withMessage('Table description is required'),
];

export const update = [
  body('name').trim().notEmpty().withMessage('Table Name is required'),
  body('description').trim().notEmpty().withMessage('Table description is required'),
];

export const createTableColumns = [
  body().isArray().withMessage('Request must be an array of columns'),
  body('*.name').trim().notEmpty().withMessage('Column Name is required'),
  body('*.data_type').trim().notEmpty().withMessage('Data Type is required'),
  body('*.length').optional().isInt({ gt: 0 }).withMessage('Length must be a positive integer'),
  body('*.precision').optional().isInt({ gt: 0 }).withMessage('Precision must be a positive integer'),
  body('*.scale').optional().isInt({ gt: 0 }).withMessage('Scale must be a positive integer'),
  body('*.constraints').optional().isObject().withMessage('Constraints must be an object'),
  body('*.collation').optional().isString().withMessage('Collation must be a string'),
  body('*.indexes').optional().isBoolean().withMessage('Indexes must be a boolean'),
  body('*.computed_column').optional().isString().withMessage('Computed Column must be a string'),
  body('*.description').optional().isString().withMessage('Description must be a string'),
];

export const updateTableColumns = [
  body().isArray().withMessage('Request must be an array of columns'),
  body('*.id').trim().notEmpty().withMessage('Column Id is required'),
  body('*.name').optional().trim().notEmpty().withMessage('Column Name is required'),
  body('*.data_type').optional().trim().notEmpty().withMessage('Data Type is required'),
  body('*.length').optional().isInt({ gt: 0 }).withMessage('Length must be a positive integer'),
  body('*.precision').optional().isInt({ gt: 0 }).withMessage('Precision must be a positive integer'),
  body('*.scale').optional().isInt({ gt: 0 }).withMessage('Scale must be a positive integer'),
  body('*.constraints').optional().isObject().withMessage('Constraints must be an object'),
  body('*.collation').optional().isString().withMessage('Collation must be a string'),
  body('*.indexes').optional().isBoolean().withMessage('Indexes must be a boolean'),
  body('*.computed_column').optional().isString().withMessage('Computed Column must be a string'),
  body('*.description').optional().isString().withMessage('Description must be a string'),
];

export const deleteTableColumns = [
  body().isArray().withMessage('Request must be an array of columns'),
  body('*.id').trim().notEmpty().withMessage('Column Id is required'),
];
