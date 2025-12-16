import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { MESSAGES } from '../../constants/messages.constant';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async register(data: any) {
    try {
      // Validation
      if (!data.email || !data.password) {
        throw new BadRequestException(MESSAGES.REQUIRED_FIELDS_MISSING);
      }

      //Check existing user
      const existingUser = await this.userService.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictException(MESSAGES.USER_ALREADY_EXISTS);
      }

      //Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);

      //Save user
      await this.userService.create({
        ...data,
        password: hashedPassword,
      });

      return {
        statusCode: 201,
        message: MESSAGES.USER_REGISTERED,
      };
    } catch (error) {
      throw error;
    }
  }

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
}
