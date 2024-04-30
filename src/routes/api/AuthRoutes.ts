import express from 'express';
import * as authController from '../../controllers/AuthController';
import * as userController from '../../controllers/UserController';
import { signupRequest, loginRequest } from '../../validators/AuthRequest';
import { storeUserPreferencesRequest } from '../../validators/UserPreferenceRequest';
import passport from 'passport';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Configure Passport for OAuth
authController.passportForOAuth();

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
 * GOOGLE LOCAL AUTH ROUTES
 * ----------------------------------------------
 */
router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.post('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authController.googleOauthCallback);

/**
 * ----------------------------------------------
 * GITHUB LOCAL AUTH ROUTES
 * ----------------------------------------------
 */
router.get('/github', passport.authenticate('github'));
router.post('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), authController.githubOauthCallback);

/**
 * ----------------------------------------------
 * USER PREFERENCES ROUTES
 * ----------------------------------------------
 */
router.post('/user/preferences', storeUserPreferencesRequest, userController.storeUserPreferences);

export default router;
