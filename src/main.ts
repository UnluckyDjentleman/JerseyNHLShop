import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser'
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session'
import * as express from 'express'
import { join } from 'path';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.use(cookieParser())
  app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: {secure: true}
  }));
  app.useGlobalPipes(new ValidationPipe());
  app.use('/uploads',express.static(join(process.cwd(),'uploads')))
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
