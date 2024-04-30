import express from 'express';
import * as authController from '../../controllers/AuthController';
import * as userController from '../../controllers/UserController';
import { signupRequest, loginRequest } from '../../validators/AuthRequest';
import { storeUserPreferencesRequest } from '../../validators/UserPreferenceRequest';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();
const appUrl = process.env.APP_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_AUTH_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_AUTH_CLIENT_SECRET;

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${appUrl}/api/auth/google/callback`
  },(_accessToken: any, _refreshToken: any, profile: any, done: any) => authController.handleGoogleAuthUser(profile, done)));

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

router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.post('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), authController.googleOauthCallback);

router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
router.post('/github/callback', authController.githubOauthCallback);

/**
 * ----------------------------------------------
 * USER PREFERENCES ROUTES
 * ----------------------------------------------
 */
router.post('/user/preferences', storeUserPreferencesRequest, userController.storeUserPreferences);

export default router;
