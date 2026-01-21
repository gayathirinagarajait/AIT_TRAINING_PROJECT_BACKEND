import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  // ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { MESSAGES } from '../../constants/messages.constant';
import { sendMail } from '../utils/mail.util';
import { resetPasswordTemplate } from '../../templates/reset-password.template';
import { welcomeTemplate } from '../../templates/welcome.template';
import { CreateUserDto } from '../../DTO/create-user.dto';


@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

//for new user 
async register(data: CreateUserDto) { 
  try {
    const hash = await bcrypt.hash(data.password, 10);

    const user = await this.userService.create({
      ...data,
      password: hash,
    });
    
    await sendMail({
      to: user.email,
      subject: 'Welcome to Our Application',
      html: welcomeTemplate(user.name),
    });
    
    return { message: MESSAGES.USER_REGISTERED };
  } catch (error) {
    console.error('Register error:', error);
    throw error;
  }
}
//mail for login
  async login(data: any) {
    try {
      if (!data.email || !data.password) {
        throw new BadRequestException(MESSAGES.REQUIRED_FIELDS_MISSING);
      }

      const user = await this.userService.findByEmail(data.email);
      if (!user) {
        throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
      }

      const isMatch = await bcrypt.compare(data.password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException(MESSAGES.INVALID_CREDENTIALS);
      }

      const token = this.jwtService.sign({
        id: user._id,
        role: user.role,
      });

      return {
        statusCode: 200,
        message: MESSAGES.LOGIN_SUCCESS,
        token,
      };
    } catch (error) {
      throw error;
    }
  }
//for forgot password
   async forgotPassword(email: string) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Save OTP & expiry (10 mins)
      user.resetOtp = otp;
      user.resetOtpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      await user.save();

      // Send mail
      await sendMail({
        to: user.email,
        subject: 'Reset Password OTP',
        html: resetPasswordTemplate(user.name, otp),
      });

      return { message: MESSAGES.OTP_SEND };
    } catch (error) {
      throw error;
    }
  }

  //otp verification
  async verifyOtpAndReset(
    email: string,
    otp: number,
    newPassword: string,
  ) {
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        throw new BadRequestException('User not found');
      }

      // OTP validation
      if (
        !user.resetOtp ||
        user.resetOtp !== Number(otp)
      ) {
        throw new BadRequestException('Invalid OTP');
      }

      // Expiry validation
      if (
        !user.resetOtpExpiry ||
        user.resetOtpExpiry < new Date()
      ) {
        throw new BadRequestException('OTP expired');
      }

      // Update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;

      // Clear OTP
      user.resetOtp = null;
      user.resetOtpExpiry = null;

      await user.save();

      return { message: 'Password reset successfully' };
    } catch (error) {
      throw error;
    }
  }
}
