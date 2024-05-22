import otpGenerator from 'otp-generator';
import { IUserModel } from '../models';

async function generateAndStoreOTP(user: IUserModel): Promise<string> {
  const otp: string = otpGenerator.generate(6, { digits: true });
  const otpExpiresAt: Date = new Date(Date.now() + 5 * 60 * 1000); // OTP expires in 5 minutes

  user.verifyOtp = otp;
  user.otpExpiresAt = otpExpiresAt;
  await user.save();

  return otp;
}

export { generateAndStoreOTP };
