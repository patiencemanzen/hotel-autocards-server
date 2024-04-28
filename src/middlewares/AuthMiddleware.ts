/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authcode = process.env.AUTH_SECRET_KEY;
  const token = req.header('Authorization') && req.header('Authorization').split(' ')[1];

  if (!token) return res.status(403).json({ status: 'error', message: 'Unauthenticated' });

  jwt.verify(token, authcode, (err: any, user: any) => {
    if (err) return res.status(401).json({ status: 'error', message: 'Invalid Auth token' });
    req.user = user;
    next();
  });
};

export { authenticate };
