import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { stringify } from 'yaml';
import { join } from 'path';
import { JustInterceptor } from './time.interceptor';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFile } from 'fs/promises';

import supertokens from 'supertokens-node';
import config from './config';
import { SupertokensExceptionFilter } from './auth/auth.filter';

import * as expressHandlebars from 'express-handlebars';

import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: false,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));

  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  const swagger = new DocumentBuilder()
    .setTitle('Salekhard')
    .setDescription('Welcome to Salekhard')
    .setVersion('1.0')
    .addSecurity('basic', {
      type: 'http',
      scheme: 'basic',
    })
    .build();

  const hbs = expressHandlebars.create({
    extname: 'hbs',
    partialsDir: join(__dirname, '..', 'views/partials'),
    defaultLayout: 'main',
    layoutsDir: join(__dirname, '..', 'views/layouts'),
    helpers: {
      increment: function (value) {
        return parseInt(value, 10) + 1;
      },
      decrement: function (value) {
        return parseInt(value, 10) - 1;
      },
    },
  });

  app.engine('hbs', hbs.engine);
  app.setViewEngine('hbs');

  const document = SwaggerModule.createDocument(app, swagger);

  SwaggerModule.setup('swagger', app, document);

  const yamlString: string = stringify(document, {});

  await writeFile('./swagger-spec.yaml', yamlString);

  app.useGlobalInterceptors(new JustInterceptor());

  app.enableCors({
    origin: [config.APP_DOMAIN],
    allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
    credentials: true,
  });

  app.useGlobalFilters(new SupertokensExceptionFilter());

  // const PORT = process.env.PORT || 3000; // TODO: process.env.PORT - глобальный объект, предоставляет доступ к переменным окружения,
  await app.listen(3000); // TODO: получаем значение переменной окружения PORT ИЛИ по умолчанию
  console.log(`Application is running on: http://localhost:${3000}`);
}
bootstrap();
