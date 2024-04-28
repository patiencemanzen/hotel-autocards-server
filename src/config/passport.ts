/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_AUTH_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET || "",
      callbackURL: process.env.GOOGLE_AUTH_CALLBACK_URL,
    },
    (_accessToken, _refreshToken, profile, done) => {
      // Use the profile information to create or
      // retrieve a user in your database
      return done(null, profile);
    }
  )
);

passport.serializeUser<any, any>((user, done) => done(null, user));
passport.deserializeUser<any, any>((obj, done) => done(null, obj));
