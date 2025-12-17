import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/user.schema';

@Injectable()
export class AuthCronService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  // Runs every 5 minutes
  @Cron('*/5 * * * *')
  async clearExpiredOtps() {
    const now = new Date();

    const result = await this.userModel.updateMany(
      {
        resetOtpExpiry: { $lt: now },
      },
      {
        $set: {
          resetOtp: null,
          resetOtpExpiry: null,
        },
      },
    );

    console.log(
      // `Cleared expired OTPs: ${result.modifiedCount}`,
    );
  }
}
