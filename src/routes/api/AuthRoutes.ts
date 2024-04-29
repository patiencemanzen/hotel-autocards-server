import express from 'express';
import * as authController from '../../controllers/AuthController';
import * as userController from '../../controllers/UserController';
import { signupRequest, loginRequest } from '../../validators/AuthRequest';
import { storeUserPreferencesRequest } from '../../validators/UserPreferenceRequest';
import passport from 'passport';

const router = express.Router();

/**
 * ----------------------------------------------
 * USER AUTH ROUTES
 * ----------------------------------------------
 */
router.post('/signup', signupRequest, authController.signup);
router.post('/signin', loginRequest, authController.login);
router.post('/request/otp', loginRequest, authController.requestOTPCode);
router.post('/verify/otp', loginRequest, authController.verifyOTPCode);
router.post('/new-password', loginRequest, authController.newCredentials);

router.get('/oauth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
router.post('/oauth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authController.googleOauthCallback);

/**
 * ----------------------------------------------
 * USER PREFERENCES ROUTES
 * ----------------------------------------------
 */
router.post('/user/preferences', storeUserPreferencesRequest, userController.storeUserPreferences);

export default router;
