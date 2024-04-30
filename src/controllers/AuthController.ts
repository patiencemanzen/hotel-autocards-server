/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, IUserModel } from "../models";
import dotenv from "dotenv";
import { validationResult } from "express-validator";
import { tryCatch } from "../helpers/general-helpers";
import { handleMongoError } from "../helpers/mongoose-healpers";
import mongoose, { ObjectId } from "mongoose";
import { generateAndStoreOTP } from "../utility/OTPUtil";
import { sendDbNotification } from "../services/NotificationService";
import axios from "axios";

dotenv.config();

/**
 * Define the IUser interface for TypeScript type checking
 */
interface IUser extends IUserModel {
  _id: ObjectId;
}

const authcode = process.env.AUTH_SECRET_KEY;
const appName = process.env.APP_NAME;

/**
 * Controller function for user signup
 *
 * Use tryCatch helper to handle async operations and errors
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const signup = async (req: Request, res: Response) => {
  return tryCatch(async () => {
      const { fullname, email, telephone, password } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).json({
          status: "error",
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        fullname: fullname.trim().toLowerCase(),
        telephone: telephone.trim().toLowerCase(),
        email, password: hashedPassword,
      });

      const token = jwt.sign(user.toObject(), authcode);
      const otp = generateAndStoreOTP(user);

      sendDbNotification(email, telephone, 
        `Welcome to ${appName}!`, `🎉 Dear ${user.fullname},\n\nWelcome to Our ${appName}! We're excited to have you on board. your OTP code ise ${otp}`,
        user
      );

      res.status(201).send({
        status: "success",
        access_token: token,
        message: "User registered successfully",
      });
    }, (error) => {
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
  return tryCatch(async () => {
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
    }, (error) => {
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
  return tryCatch(async () => {
      const token = jwt.sign({ userId: (req.user as IUser)._id }, authcode);

      res.status(200).send({
        status: "success",
        access_token: token,
        message: "User authenticated successfully",
      });
    }, (error) => {
      return res.status(400).json({
        status: "error",
        error: error,
        message: error.message || "Unable to authenticate with Google",
      });
    }
  );
};

/**
 * Handle Google Auth callback User
 * 
 * @param profile 
 * @param done 
 * @returns 
 */
export const handleGoogleAuthUser = async (profile, done) => {
  return tryCatch(async () => {
    const user = await User.findOne({ email: profile.emails[0].value });

    if (user) return done(null, user);

    const newUser = await User.create({
      fullname: profile.displayName,
      email: profile.emails[0].value,
      password: '',
    });
    
    return done(null, newUser);
  }, (error) => done(error, null));
}

/**
 * Callback function for handling GitHub OAuth authentication.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const githubOauthCallback = async (req: Request, res: Response) => {
  return tryCatch(async () => {
      const requestToken = req.query.code
      const clientID = process.env.GITHUB_CLIENT_ID;
      const clientSecret = process.env.GITHUB_CLIENT_SECRET;

      axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
        headers: { accept: 'application/json' }
      }).then((response) => {
        const authToken = handleGithubCallbackUser(response.data.access_token)

        res.status(200).send({
          status: authToken ? "success" : "error",
          access_token: authToken,
          message: authToken ? "User authenticated successfully" : "Unable to authenticate with Github",
        });
      });
    }, (error) => {
      return res.status(400).json({
        status: "error",
        error: error,
        message: error.message || "Unable to authenticate with Github",
      });
    }
  );
}

/**
 * Callback function for handling GitHub OAuth authentication.
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
const handleGithubCallbackUser = async (access_token: string) => {
  axios({
    method: 'get',
    url: `https://api.github.com/user`,
    headers: { Authorization: 'token ' + access_token }
  }).then(async (response) => {
    const authUser = response.data;

    if(authUser && authUser.email) {
      const user = await User.findOne({ email: authUser.email });

      if (!user) {
        await User.create({
          fullname: authUser.name,
          telephone: '',
          email: authUser.email,
          avatar: authUser.avatar,
          remember_token: authUser.token,
          password: "",
        });
      }

      const userId: ObjectId = (user as IUser)._id;
      const token = jwt.sign({ userId: userId }, authcode);

      return token;
    }

    else {
      return null;
    }
  })
}

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

      sendDbNotification(email, "", `Your One-Time Password (OTP) for ${appName} Verification`, `Hello, \n Thank you for using our service. Your One-Time Password (OTP) for account verification is: \n [${otp}] \n Please use this code within the next [5 min] minutes. If you did not request this code, please ignore this email.`, user);
     
      res.status(200).send({
        status: "success",
        message: "User OTP  Generated Successfully",
      });
    }, (error) => {
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

      if (user.verifyOtp !== otp || user.otpExpiresAt < new Date())
        return res.status(400).json({ message: "Invalid or expired OTP" });

      user.verifyOtp = null;
      user.otpExpiresAt = null;
      user.verified = true;

      await user.save();

      return res.status(200).json({ message: "OTP verified successfully" });
    }, (error) => {
      return res
        .status(400)
        .json({ message: "Unable to verify you OTP", errors: error });
    }
  );
};

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
