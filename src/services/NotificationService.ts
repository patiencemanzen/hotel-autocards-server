/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { tryCatch } from "../helpers/general-helpers";
import dotenv from "dotenv";
import { IUserModel, Notification } from "../models";
import Mailgun from 'mailgun-js';

dotenv.config();

/**
 * Send email notification
 * 
 * @param email 
 * @param subject 
 * @param message 
 * @returns 
 */
export const sendEmailNotifation = async (email: string, subject: string, message: string) => {
  return tryCatch(async () => {
      if (process.env.APP_ENV == "production" || process.env.APP_ENV == "testing") {
        const mailgun = Mailgun({ apiKey: 'your-mailgun-api-key', domain: 'your-mailgun-domain' });

        const data = {
          from: process.env.MAILGUN_FROM_EMAIL,
          to: email,
          subject: subject,
          text: message,
        };
        
        mailgun.messages().send(data, (error, body) => {
          if (error) {
            console.error('Failed to send email:', error);
          } else {
            console.log('Email sent:', body);
          }
        });
      }
    }, (error) => {
      console.log(error);
    }
  );
};

/**
 * Send Database notification
 * 
 * @param telephone 
 * @param message 
 * @returns 
 */
export const sendDbNotification = async (email: string, telephone: string, subject: string, message: string, user: IUserModel) => {
  await Notification.create({
    email: email,
    phoneNumber: telephone,
    subject: subject,
    message: message,
    user: user
  });
}
