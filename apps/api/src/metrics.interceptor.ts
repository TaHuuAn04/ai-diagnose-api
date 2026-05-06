import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { Counter, Histogram } from 'prom-client';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  constructor(
    @InjectMetric('http_request_duration_seconds')
    private readonly histogram: Histogram,
    @InjectMetric('http_request_total')
    private readonly counter: Counter,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const req = context.switchToHttp().getRequest();
    const method: string = req.method;
    const route: string = req.route?.path ?? req.url;
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const res = context.switchToHttp().getResponse();
          const statusCode = String(res.statusCode);
          const duration = (Date.now() - startTime) / 1000;
          this.histogram.labels(method, route, statusCode).observe(duration);
          this.counter.labels(method, route, statusCode).inc();
        },
        error: (err: { status?: number }) => {
          const statusCode = String(err?.status ?? 500);
          const duration = (Date.now() - startTime) / 1000;
          this.histogram.labels(method, route, statusCode).observe(duration);
          this.counter.labels(method, route, statusCode).inc();
        },
      }),
    );
  }
}
