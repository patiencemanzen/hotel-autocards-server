/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { User } from '../models';

dotenv.config();

/**
 * Middleware to authenticate user
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns 
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).send({ message: 'No Auth token provided' });

  const parts = authHeader.split(' ');

  if (parts.length !== 2) return res.status(401).send({ message: 'Token error' });

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) return res.status(401).send({ message: 'Token malformatted' });

  jwt.verify(token, process.env.AUTH_SECRET_KEY, async (err: any, user: any) => {
    if (err) return res.status(401).send({ message: 'Invalid token' });

    const userModel = await User.findById(user.userId);

    if (!userModel) return res.status(404).send({ message: 'User not found' });

    req.user = userModel;

    return next();
  });
};
