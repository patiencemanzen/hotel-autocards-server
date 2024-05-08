import { body } from 'express-validator';

export const create = [
  body('databaseId').trim().notEmpty().withMessage('Database ID is required'),
  body('databaseStructure').isArray().withMessage('Database structure must be an array'),

  body('databaseStructure.*.tableName').trim().notEmpty().withMessage('Table name is required'),
  body('databaseStructure.*.filename').trim().notEmpty().withMessage('Table name is required'),
  body('databaseStructure.*.tech_stack').trim().notEmpty().withMessage('Table name is required'),
  body('databaseStructure.*.tableDefinitions').isArray().withMessage('Table definitions must be an array'),


  body('databaseStructure.*.tableDefinitions.*.column').trim().notEmpty().withMessage('Column name is required'),
  body('databaseStructure.*.tableDefinitions.*.datatype').trim().notEmpty().withMessage('Datatype must not be empty'),
];