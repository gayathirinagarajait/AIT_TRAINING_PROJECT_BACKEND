import { Controller, Post, Body , BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
//for new user
  @Post('register')
  register(@Body() body: any) {
    return this.authService.register(body);
  }
//for existing user
  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }
// for forgot password 
   @Post('forgot-password')
  async forgotPassword(@Body() body: any) {
    try {
      if (!body.email) {
        throw new BadRequestException('Email is required');
      }

      return await this.authService.forgotPassword(body.email);
    } catch (error) {
      throw error;
    }
  }

  //reset
  @Post('verify-otp')
  async verifyOtpAndReset(@Body() body: any) {
    try {
      const { email, otp, newPassword } = body;

      if (!email || !otp || !newPassword) {
        throw new BadRequestException(
          'email, otp and newPassword are required',
        );
      }

      return await this.authService.verifyOtpAndReset(
        email,
        otp,
        newPassword,
      );
    } catch (error) {
      throw error;
    }
  }
}
