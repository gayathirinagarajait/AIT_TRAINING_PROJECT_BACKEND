import { JwtAuthGuard } from './jwt_auth.guard';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ExecutionContext } from '@nestjs/common';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = {
      verify: jest.fn(),
    } as any;

    guard = new JwtAuthGuard(jwtService);
  });

  /* ===================== HELPERS ===================== */

  const mockExecutionContext = (authorization?: string): ExecutionContext =>
    ({
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization,
          },
        }),
      }),
    } as any);

  /* ===================== TESTS ===================== */

  it('should allow access with valid token', () => {
    const decodedUser = { id: '1', email: 'test@test.com' };

    (jwtService.verify as jest.Mock).mockReturnValue(decodedUser);

    const context = mockExecutionContext('Bearer valid-token');

    const result = guard.canActivate(context);

    expect(jwtService.verify).toHaveBeenCalledWith('valid-token');
    expect(result).toBe(true);
  });

  it('should attach decoded user to request', () => {
    const decodedUser = { id: '1' };

    (jwtService.verify as jest.Mock).mockReturnValue(decodedUser);

    const request: any = {
      headers: {
        authorization: 'Bearer valid-token',
      },
    };

    const context: ExecutionContext = {
      switchToHttp: () => ({
        getRequest: () => request,
      }),
    } as any;

    guard.canActivate(context);

    expect(request.user).toEqual(decodedUser);
  });

  it('should throw UnauthorizedException if token is missing', () => {
    const context = mockExecutionContext();

    expect(() => guard.canActivate(context)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw UnauthorizedException if token is invalid', () => {
    (jwtService.verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid token');
    });

    const context = mockExecutionContext('Bearer invalid-token');

    expect(() => guard.canActivate(context)).toThrow(
      UnauthorizedException,
    );
  });
});
