import { body } from 'express-validator';

export const signupRequest = [
  body('firstname').trim().notEmpty().withMessage('Firstname is required'),
  body('lastname').trim().notEmpty().withMessage('Lastname is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

export const loginRequest = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];
