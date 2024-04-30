/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Request, Response } from "express";
import { IUserModel, UserPreferences } from "../models";
import dotenv from "dotenv";
import { tryCatch } from "../helpers/general-helpers";
import { ObjectId } from "mongoose";
import AuthUserUtility from "../utility/AuthUserUtils";

dotenv.config();

interface IUser extends IUserModel {
  _id: ObjectId;
}

/**
 * Controller function for user preferences
 *
 * Use tryCatch helper to handle async operations and errors
 *
 * @param req - Express Request object
 * @param res - Express Response object
 */
export const storeUserPreferences = async (req: Request, res: Response) => {
  const { address } = req.body;

  return tryCatch(
    async () => {
      const authUser = AuthUserUtility.getUser(req);
      const userId: ObjectId = (authUser as unknown as IUser)._id;
      let userPreferences = await UserPreferences.findOne({ user_id: userId });

      if (!userPreferences) {
        userPreferences = new UserPreferences({ user_id: userId, address });
        await userPreferences.save();
      } else {
        userPreferences.address = address;
        await userPreferences.save();
      }

      res.status(200).json({
        message: "User preferences saved successfully",
        userPreferences,
      });
    },
    (error) => {
      res.status(500).json({
        message: error.message || "Unable to store user preferences",
      });
    }
  );
};
