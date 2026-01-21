import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../users/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { sendMail } from '../utils/mail.util';

jest.mock('../utils/mail.util', () => ({
  sendMail: jest.fn(),
}));

const mockUser = {
  _id: '123',
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashedPassword',
  role: 'user',
  resetOtp: null,
  resetOtpExpiry: null,
  save: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;
  let userService: jest.Mocked<UserService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            create: jest.fn(),
            findByEmail: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get(UserService);
    jwtService = module.get(JwtService);
  });

  it('should register a user and send welcome mail', async () => {
  jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedPassword' as never);
  userService.create.mockResolvedValue(mockUser as any);

  const result = await service.register({
    email: 'test@example.com',
    password: '123456',
    name: 'Test',
  });

  expect(userService.create).toHaveBeenCalled();
  expect(sendMail).toHaveBeenCalled();
  expect(result.message).toBeDefined();
});

it('should login user successfully', async () => {
  userService.findByEmail.mockResolvedValue(mockUser as any);
  jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
  jwtService.sign.mockReturnValue('jwt_token');

  const result = await service.login({
    email: 'test@example.com',
    password: '123456',
  });

  expect(result.token).toBe('jwt_token');
});
it('should throw UnauthorizedException for wrong password', async () => {
  userService.findByEmail.mockResolvedValue(mockUser as any);
  jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

  await expect(
    service.login({ email: 'test@example.com', password: 'wrong' }),
  ).rejects.toThrow(UnauthorizedException);
});

it('should send OTP for forgot password', async () => {
  userService.findByEmail.mockResolvedValue(mockUser as any);

  const result = await service.forgotPassword('test@example.com');

  expect(mockUser.save).toHaveBeenCalled();
  expect(sendMail).toHaveBeenCalled();
  expect(result.message).toBeDefined();
});
it('should verify OTP and reset password', async () => {
  const userWithOtp = {
    ...mockUser,
    resetOtp: 123456,
    resetOtpExpiry: new Date(Date.now() + 10000),
  };

  userService.findByEmail.mockResolvedValue(userWithOtp as any);
  jest.spyOn(bcrypt, 'hash').mockResolvedValue('newHashedPass' as never);

  const result = await service.verifyOtpAndReset(
    'test@example.com',
    123456,
    'newPassword',
  );

  expect(userWithOtp.save).toHaveBeenCalled();
  expect(result.message).toBe('Password reset successfully');
});
})
