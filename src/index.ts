import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';

import { MongoDBConnection, createDatabase } from './database/db';
import routes from "./routes/index"

dotenv.config();

const app = express();
const app_port = process.env.APP_URL_PORT;

app.use(session({ secret: process.env.AUTH_SECRET_KEY, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

createDatabase(new MongoDBConnection(), (error: never) => console.log(`Unable to connect to database - ${error}`));

app.listen(app_port, () => console.log(`App is listening to port: ${app_port}`));
