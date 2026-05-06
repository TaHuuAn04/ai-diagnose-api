import { Controller, Get, Res } from '@nestjs/common';

import { Response } from 'express';
import { register } from 'prom-client';

import { IsPublic } from '@app/core/decorators';

@IsPublic()
@Controller()
export class MetricsController {
  @Get('/metrics')
  async index(@Res() response: Response): Promise<void> {
    response.set('Content-Type', register.contentType);
    response.end(await register.metrics());
  }
}
