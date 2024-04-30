import { Request } from 'express';
import { User, IUserModel } from '../models';
import { ObjectId } from 'mongoose';

interface IUser extends IUserModel {
  userId: ObjectId;
}

class AuthUserUtility {
  static async getUser(req: Request): Promise<IUserModel | null | void> {
    const authUser = req.user;
    if (!authUser) throw new Error('Authentication information not available');

    const userId: ObjectId = (authUser as IUser).userId;
    const user = await User.findOne({ user_id: userId });
    return user;
  }
}

export default AuthUserUtility;
