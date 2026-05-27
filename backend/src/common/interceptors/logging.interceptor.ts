import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<Request>();

    const now = Date.now();

    console.log(`[REQUEST] ${req.method} ${req.url}`);

    return next.handle().pipe(
      tap(() => {
        console.log(
          `[RESPONSE] ${req.method} ${req.url} - ${Date.now() - now}ms`,
        );
      }),
    );
  }
}
