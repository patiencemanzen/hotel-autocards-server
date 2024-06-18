import { body } from 'express-validator';

export const signupRequest = [
  body('fullname').trim().notEmpty().withMessage('Fullname is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('telephone').optional().isMobilePhone('any').withMessage('Invalid telephone'),  
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

export const loginRequest = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

export const loginDriverRequest = [
  body('username').trim().notEmpty().withMessage('Invalid username'),
  body('pin_number').isNumeric().withMessage('Invalid pin number'),
];