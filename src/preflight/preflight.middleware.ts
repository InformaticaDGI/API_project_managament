import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class PreflightMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    if (req.method === 'OPTIONS') {
      res.status(200).send();
      return;
    }
    next();
  }
}
