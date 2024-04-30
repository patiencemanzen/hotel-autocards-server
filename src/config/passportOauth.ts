/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import dotenv from "dotenv";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github";
import { handleCallbackAuthUser } from "../controllers/AuthController";

dotenv.config();

export const oauthServices = () => {
  const {
    GOOGLE_AUTH_CLIENT_ID: GOOGLE_CLIENT_ID,
    GOOGLE_AUTH_CLIENT_SECRET: GOOGLE_CLIENT_SECRET,
    GOOGLE_AUTH_CALLBACK_URL: GOOGLE_CALLBACK_URL,

    GITHUB_AUTH_CLIENT_ID: GITHUB_CLIENT_ID,
    GITHUB_AUTH_CLIENT_SECRET: GITHUB_CLIENT_SECRET,
    GITHUB_AUTH_REDIRECT_URL: GITHUB_REDIRECT_URL,
  } = process.env;

  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: GOOGLE_CALLBACK_URL,
      },
      (
        _accessToken,
        _refreshToken,
        profile,
        done: (error: any, user?: any) => void
      ) => handleCallbackAuthUser(profile, done)
    )
  );

  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: GITHUB_REDIRECT_URL,
      },
      async (
        _accessToken: any,
        _refreshToken: any,
        profile: any,
        done: (error: any, user?: any) => void
      ) => handleCallbackAuthUser(profile, done)
    )
  );

  passport.serializeUser<any, any>(
    (user, done: (error: any, user?: any) => void) => done(null, user)
  );
  passport.deserializeUser<any, any>(
    (obj, done: (error: any, user?: any) => void) => done(null, obj)
  );
};
