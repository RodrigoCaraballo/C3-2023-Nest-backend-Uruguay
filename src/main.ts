// Libraries
import { NestFactory } from '@nestjs/core';

// Main module
import { AppModule } from './app.module';
import {
  AccountTypeEntity,
  DocumentTypeEntity,
} from './data/persistence/entities/';
import {
  AccountTypeRepository,
  DocumentTypeRepository,
} from './data/persistence/repositories/';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
