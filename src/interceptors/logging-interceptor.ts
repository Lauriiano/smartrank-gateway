/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {

		const now = Date.now();

		return next.handle().pipe(tap(() => console.log(`tempo de requisicao: ${Date.now() - now}ms`)));
	}
}
