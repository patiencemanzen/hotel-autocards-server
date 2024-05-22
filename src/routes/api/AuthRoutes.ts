import express from 'express';
import * as authController from '../../controllers/AuthController';
import { signupRequest, loginRequest, loginDriverRequest } from '../../validators/AuthRequest';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

/**
 * ----------------------------------------------
 * USER LOCAL AUTH ROUTES
 * ----------------------------------------------
 */
router.post('/signup', signupRequest, authController.signup);
router.post('/signin', loginRequest, authController.login);
router.post('/request/otp', loginRequest, authController.requestOTPCode);
router.post('/verify/otp', loginRequest, authController.verifyOTPCode);
router.post('/new-password', loginRequest, authController.newCredentials);

/**
 * ----------------------------------------------
 * DRIVER AUTH ROUTES
 * ----------------------------------------------
 */
router.post('/driver/signin', loginDriverRequest, authController.driverSignin);

/**
 * ----------------------------------------------
 * GOOGLE AUTH CALLBACK ROUTES
 * ----------------------------------------------
 */
router.post('/oauth/callback', authController.handleOauthCallback);

export default router;
