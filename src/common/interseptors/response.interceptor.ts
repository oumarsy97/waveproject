import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { map } from 'rxjs/operators';
  
  @Injectable()
  export class ResponseInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      return next.handle().pipe(
        map((data) => {
          // Format de réponse uniforme
          return {
            success: true,
            data: data,
            message: 'Opération réussie',
            statusCode: context.switchToHttp().getResponse().statusCode,
          };
        }),
      );
    }
  }
  