import { Test } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';


describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn(),
            login: jest.fn(),
            forgotPassword: jest.fn(),
            verifyOtpAndReset: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get(AuthController);
    authService = module.get(AuthService);
  });

  it('should call forgotPassword service', async () => {
    authService.forgotPassword.mockResolvedValue({ message: 'OTP sent' });

    const result = await controller.forgotPassword({
      email: 'test@example.com',
    });

    expect(result.message).toBe('OTP sent');
  });
});
