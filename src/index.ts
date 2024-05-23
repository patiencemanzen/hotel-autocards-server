import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import { Server } from 'socket.io';
import cors from 'cors';

import { MongoDBConnection, createDatabase } from './database/db';
import routes from "./routes/index";
import { updateDatabaseWithCoordinates } from './controllers/WebSocketController';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(session({ secret: process.env.AUTH_SECRET_KEY, resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/', (_req, res) => res.send('Welcome to parronaut-server api gateway!'));  

app.use(routes);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

createDatabase(new MongoDBConnection(), (error: never) => console.log(`Unable to connect to database - ${error}`));

const server = app.listen(port, () => console.log(`App is listening to port: ${port}`, port));

const io = new Server(server, {
  cors: {
    origin: "*", // Adjust this to match your client-side domain
    methods: ["GET", "POST"]
  }
});

let buses = [];
let passengers = {};

io.on('connection', (socket) => {
  socket.on('new-coordinates', (data) => {
    updateDatabaseWithCoordinates(data);

    let bus = buses.find(bus => bus.route === data.route);

    if (bus) {
      bus.bus_from = data.bus_from;
      bus.bus_to = data.bus_to;
    } else {
      buses.push(data);
    }

    socket.join(data.route);
    io.to(data.route).emit('buses-coordinates', buses);
  });

  socket.on('join-route', (route) => {
    if (passengers[socket.id])
      socket.leave(passengers[socket.id]);

    socket.join(route);

    passengers[socket.id] = route;
  });
});

io.on('disconnect', (socket) => {
  delete passengers[socket.id];
});