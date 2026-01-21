import { Injectable, NestMiddleware } from '@nestjs/common';


//for all api's
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // console.log(`[${req.method}] ${req.originalUrl}`);
    next();
  }
}
