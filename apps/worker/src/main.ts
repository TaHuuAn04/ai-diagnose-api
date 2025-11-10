import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { initializeTransactionalContext } from 'typeorm-transactional';

import { WORKER_PORT } from '@app/core/environments';

import { WorkerModule } from './main.module';

async function bootstrap() {
  // Initialize transactional context for typeorm-transactional
  // Note: This is necessary for using @Transactional decorator
  // TODO: need to refactor for shared module
  initializeTransactionalContext();
  const app = await NestFactory.create(WorkerModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: false,
      },
    }),
  );
  await app.listen(WORKER_PORT);
}

bootstrap().catch((error: unknown) => {
  console.error('Error during app bootstrap', error);
});
