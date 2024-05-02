import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';

import { MongoDBConnection, createDatabase } from './database/db';
import routes from "./routes/index";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(session({ secret: process.env.AUTH_SECRET_KEY, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

createDatabase(new MongoDBConnection(), (error: never) => console.log(`Unable to connect to database - ${error}`));

app.listen(port, () => console.log(`App is listening to port: ${port}`));
