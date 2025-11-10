import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CorePaginateResult } from './interfaces';

@Injectable()
export class CoreTransformInterceptor<T>
  implements NestInterceptor<T, CorePaginateResult<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CorePaginateResult<T>> {
    return next.handle().pipe(
      map((result) => {
        const response = {
          success: true,
          statusCode: HttpStatus.OK,
          message: 'success',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          data: result || null,
        };

        return response;
      }),
    );
  }
}