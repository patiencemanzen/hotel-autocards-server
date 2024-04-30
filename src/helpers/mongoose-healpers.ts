/* eslint-disable @typescript-eslint/explicit-function-return-type */
import mongoose from "mongoose";

export const handleMongoError = (error: unknown) => {
  if (error instanceof mongoose.Error.ValidationError) {
    return { status: 400, error: "Validation failed", details: error.errors };
  } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
    return { status: 400, error: "User not found" };
  } else if (error instanceof mongoose.Error.CastError) {
    return { status: 400, error: "Invalid ID" };
  } else if (error instanceof mongoose.Error) {
    return { status: 500, error: "Internal database Error" };
  } else if (
    error instanceof mongoose.mongo.MongoError &&
    error.code === 11000
  ) {
    return {
      status: 500,
      error: "Email already registered with us",
      errors: error,
    };
  } else {
    return { status: 500, error: "Internal Server Error", errors: error };
  }
};
