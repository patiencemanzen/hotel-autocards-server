/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose, { ConnectOptions, Connection } from "mongoose";
import dotenv from "dotenv";
import { tryCatch } from "../helpers/general-helpers";

dotenv.config();

type ErrorCallback = (error: Error) => void;

export interface DatabaseConnector {
  connect: () => Promise<Connection>;
}

export class MongoDBConnection implements DatabaseConnector {
  /**
   * Establishes a connection to MongoDB using the provided URI and options.
   * Handles potential errors using the tryCatch utility.
   *
   * @returns A Promise<void> representing the success or failure of the connection.
   */
  async connect(): Promise<Connection> {
    const connection = await mongoose.connect(
      process.env.MONGODB_URI,
      {} as ConnectOptions
    );
    console.log("Database Established");
    return connection.connection;
  }
}

export const createDatabase = (
  connector: DatabaseConnector,
  fallback: ErrorCallback
) => {
  return tryCatch(
    async () => connector.connect(),
    (error) => fallback(error)
  );
};
