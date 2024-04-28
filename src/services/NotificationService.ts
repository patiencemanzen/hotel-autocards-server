/* eslint-disable @typescript-eslint/explicit-function-return-type */
// import { INotification } from "../models";
import { tryCatch } from "../helpers/general-helpers";
import dotenv from "dotenv";

dotenv.config();

export const sendEmail = async () => {
  return tryCatch(async () => {
      if (process.env.APP_ENV == "production" || process.env.APP_ENV == "testing") {
      }
    }, (error) => {
      console.log(error);
    }
  );
};

export const sendSMS = async () => {
  if (process.env.APP_ENV == "production" || process.env.APP_ENV == "testing") {
    return tryCatch(async () => {

      }, (error) => {
        throw error;
      }
    );
  }
};
