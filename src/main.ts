import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();
const { PORT } = process.env;
async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    app.enableCors();
    await app.listen(PORT);

    console.log(`Database connection successful. Use port: ${PORT}`);
  } catch (err) {
    console.log(err.message);
    process.exit(1);
  }
}
bootstrap();
