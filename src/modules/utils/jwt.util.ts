import { JwtService } from '@nestjs/jwt';

export const generateToken = (
  jwtService: JwtService,
  payload: any,
) => {
  return jwtService.sign(payload);
};
