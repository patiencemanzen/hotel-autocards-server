import { body } from 'express-validator';

export const signupRequest = [
  body('fullname').trim().notEmpty().withMessage('Fullname is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('telephone').isMobilePhone('any').withMessage('Invalid telephone number'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const loginRequest = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];