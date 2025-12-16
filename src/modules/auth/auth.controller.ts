import { Controller, Post, Body } from '@nestjs/common';
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
}
