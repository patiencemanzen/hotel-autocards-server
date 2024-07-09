import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import cors from "cors";

import { MongoDBConnection, createDatabase } from "./database/db";
import routes from "./routes/index";
import {
  createWebSocket,
  handleSocketConnection,
  handleSocketDisconnection,
} from "./integrations/WebSocketModule";
import { SocketHandler } from "./services/WebSocketService";
import connectMongoDBSession from "connect-mongodb-session";
import { Card, CustomerId } from "./models";

const MongoDBStore = connectMongoDBSession(session);

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const store = new MongoDBStore({
  uri: process.env.MONGODB_URI,
  collection: "appSessions",
});

app.use(
  session({
    secret: process.env.AUTH_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
    store: store,
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 }, // 1 week
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (_req, res) => res.send("Welcome api gateway!"));

app.use(routes);

passport.serializeUser((user, cb) => cb(null, user));
passport.deserializeUser((obj, cb) => cb(null, obj));

createDatabase(new MongoDBConnection(), (error: never) =>
  console.log(`Unable to connect to database - ${error}`)
);

const server = app.listen(port, () =>
  console.log(`App is listening to port: ${port}`, port)
);
const webSocket = createWebSocket(server);

handleSocketConnection(webSocket, (socket) => {
  const socketHandler = new SocketHandler(socket, webSocket);
  socketHandler.handleNewCustomer();
});

handleSocketDisconnection(webSocket, (socket) => {
  console.log(`Socket ${socket.id} disconnected`);
});

// New API endpoint to emit "server-created" event and call newCustomer
app.post("/api/customers", async (req, res) => {
  const { id } = req.body;

  const card = await Card.findOne({ serial_number: id });

  if (!card) {
    webSocket.emit("new_customer_signed_in", {
      registeredCard: false,
      cardId: id,
    });

    return res.status(401).send({ status: "error", message: "Card Not found" });
  }

  const customer = await CustomerId.findOne({ card_id: card._id }).populate(
    "customer"
  );

  if (!customer) {
    webSocket.emit("new_customer_signed_in", {
      hasOwner: false,
      registeredCard: true,
      cardId: card._id,
    });

    return res.status(401).send({ status: "error", message: "Id Not found" });
  }

  webSocket.emit("new_customer_signed_in", {
    hasOwner: true,
    registeredCard: true,
    customer: customer,
    card: card,
  });

  res.status(201).send({
    status: "success",
    customer: customer,
    message: "customer found successfully",
  });
});
