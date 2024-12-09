import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppConfigService } from './config/app-config.service';

async function bootstrap() {
  // Create the NestJS application
  const app = await NestFactory.create(AppModule);

  // Retrieve app configuration service
  const appConfig = app.get(AppConfigService);

  // Security headers with Helmet
  // app.use(
  //   helmet({
  //     hsts: {
  //       maxAge: 63072000, // 2 years
  //       includeSubDomains: true,
  //       preload: true,
  //     },
  //   }),
  // );

  // Enable CORS for specific domains
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,POST,PUT,DELETE,PATCH,OPTION',
  });

  // Cookie parser middleware
  // app.use(cookieParser());

  // Enable API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Enable shutdown hooks
  app.enableShutdownHooks();

  // Use global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unrecognized properties
      forbidNonWhitelisted: true, // Reject unrecognized properties
      transform: true, // Automatically transform DTOs
    }),
  );

  

  // Register global exception filter
  // app.useGlobalFilters(new CustomExceptionFilter());

  // Set up Swagger for API documentation
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Central - Justcall')
    .setDescription('Core APIs for Justcall Central')
    .setVersion('1.0')
    .addTag('Central')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/', app, document);

  // Start the application
  const port = appConfig.httpPort || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Application is running on: http://localhost:${port}/api`);
}
bootstrap();
