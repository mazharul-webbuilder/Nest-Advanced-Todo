import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((response) => {
        const data = response?.data?.toJSON
          ? response.data.toJSON()
          : (response.data ?? response);
        return {
          success: true,
          message: response?.message ?? null,
          data,
        };
      }),
    );
  }
}
