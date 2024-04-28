/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, IUserModel, Notification } from "../models";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { handleMongoError } from "../helpers/mongoose-healpers";
import mongoose, { ObjectId } from "mongoose";
// import { sendEmail } from "../services/NotificationService";
import { generateAndStoreOTP } from "../utility/OTPUtil";

dotenv.config();

/**
 * Define the IUser interface for TypeScript type checking
 */
interface IUser extends IUserModel {
  _id: ObjectId;
}

const authcode = process.env.AUTH_SECRET_KEY;

/**
 * Controller function for user signup
 *
 * Use tryCatch helper to handle async operations and errors
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const signup = async (req: Request, res: Response) => {
  return tryCatch(
    async () => {
      const { firstname, lastname, email, password } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          status: "error",
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        firstname: firstname.trim().toLowerCase(),
        lastname: lastname.trim().toLowerCase(),
        email,
        avatar: "",
        remember_token: "",
        verify_otp: "",
        password: hashedPassword,
      });

      await user.save();

      const token = jwt.sign(user, authcode);
      const otp = generateAndStoreOTP(user);

      await Notification.create({
        email: email,
        phoneNumber: "",
        subject: "Welcome to Citi-app!",
        message: `🎉 Dear ${user.lastname},\n\nWelcome to Our citi-app! We're excited to have you on board. your OTP code ise ${otp}`,
      });

      // await sendEmail(notification);

      res.status(201).send({
        status: "success",
        access_token: token,
        message: "User registered successfully",
      });
    },
    (error) => {
      const { status, error: errorMessage, details } = handleMongoError(error);
      res.status(status).json({ error: errorMessage, details });
    }
  );
};

/**
 * Controller function for user login
 *
 * Use tryCatch helper to handle async operations and errors
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const login = async (req: Request, res: Response) => {
  return tryCatch(
    async () => {
      const { email, password } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          status: "error",
          errors: errors.array(),
          message: "Validation failed",
        });
      }

      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password)))
        return res
          .status(401)
          .send({ status: "error", message: "Invalid email or password" });

      const userId: ObjectId = (user as IUser)._id;
      const token = jwt.sign({ userId: userId }, authcode);

      res.status(201).send({
        status: "success",
        access_token: token,
        message: "User authenticated successfully",
      });
    },
    (error) => {
      if (error instanceof mongoose.Error) {
        const {
          status,
          error: errorMessage,
          details,
        } = handleMongoError(error);
        return res.status(status).json({ error: errorMessage, details });
      }

      return res.status(400).json({
        status: "error",
        error: error,
        message: error.message || "Unable to authenticate",
      });
    }
  );
};

/**
 * Callback function for handling Google OAuth authentication.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const googleOauthCallback = async (req: Request, res: Response) => {
  return tryCatch(
    async () => {
      const authUser = req.user;
      const user = await User.findOne({ email: (authUser as IUser).email });

      if (!user) {
        const user = new User({
          firstname: (authUser as IUser).firstname.trim().toLowerCase(),
          lastname: (authUser as IUser).lastname.trim().toLowerCase(),
          email: (authUser as IUser).email,
          avatar: "",
          remember_token: "",
          password: "",
        });

        await user.save();
      }

      const userId: ObjectId = (user as IUser)._id;
      const token = jwt.sign({ userId: userId }, authcode);

      res.status(200).send({
        status: "success",
        access_token: token,
        message: "User authenticated successfully",
      });
    },
    (error) => {
      return res.status(400).json({
        status: "error",
        error: error,
        message: error.message || "Unable to authenticate",
      });
    }
  );
};

/**
 * Request OTP code for a user
 *
 * @param req Request object
 * @param res Response object
 * @returns Promise<void>
 */
export const requestOTPCode = async (req: Request, res: Response) => {
  const { email } = req.body;

  tryCatch(
    async () => {
      const user: IUserModel | null = await User.findOne({ email });
      if (!user) return res.status(404).json({ message: "User not found" });

      const otp = generateAndStoreOTP(user);

      await Notification.create({
        email: email,
        phoneNumber: "",
        subject: "Your One-Time Password (OTP) for citi-app Verification",
        message: `Hello [User's Name], \n Thank you for using our service. Your One-Time Password (OTP) for account verification is: \n [${otp}] \n Please use this code within the next [5 min] minutes. If you did not request this code, please ignore this email.`,
      });

      // await sendEmail(notification);

      res.status(200).send({
        status: "success",
        message: "User OTP  Generated Successfully",
      });
    },
    (error) => {
      res.status(400).send({
        status: "error",
        message: "User OTP  Generated Successfully",
        errors: error,
      });
    }
  );
};

/**
 * Verify OTP code for a user
 *
 * @param req Request object
 * @param res Response object
 * @returns Promise<void>
 */
export const verifyOTPCode = async (req: Request, res: Response) => {
  const { user_id, otp } = req.body;

  return tryCatch(
    async () => {
      const user: IUserModel | null = await User.findById(user_id);

      if (!user) return res.status(404).json({ message: "User not found" });

      if (user.verify_otp !== otp || user.otp_expires_at < new Date())
        return res.status(400).json({ message: "Invalid or expired OTP" });

      // Clear OTP-related fields and mark user as verified
      user.verify_otp = null;
      user.otp_expires_at = null;
      user.verified = true;
      await user.save();

      return res.status(200).json({ message: "OTP verified successfully" });
    },
    (error) => {
      return res
        .status(400)
        .json({ message: "Unable to verify you OTP", errors: error });
    }
  );
};

// TODO think about the security of this process
/**
 * Create and store newly user passwords and credentials
 *
 * @param req Request object
 * @param res Response object
 * @returns Promise<void>
 */
export const newCredentials = async (req: Request, res: Response) => {
  const { new_password, confirm_password, user_id } = req.body;

  return tryCatch(
    async () => {
      if (new_password !== confirm_password)
        return res.status(400).json({ message: "Both Password don't match" });

      const user: IUserModel | null = await User.findById(user_id);
      const hashedPassword = await bcrypt.hash(new_password, 10);

      user.password = hashedPassword;
      user.save();

      return res.status(200).json({ message: "Password updated successfully" });
    },
    (error) => {
      return res
        .status(400)
        .json({ message: "Unable to update your credentials", error: error });
    }
  );
};
