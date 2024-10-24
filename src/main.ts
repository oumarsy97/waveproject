import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // Configure Swagger
   const config = new DocumentBuilder()
   .setTitle('API Documentation')
   .setDescription('Description de l\'API')
   .setVersion('1.0')
   .build();

   //cors
   app.enableCors({
     origin: '*',
     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
     credentials: true
   });
 
 const document = SwaggerModule.createDocument(app, config);
 SwaggerModule.setup('api', app, document); // 'api' est l'URL pour accéder à Swagger

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
