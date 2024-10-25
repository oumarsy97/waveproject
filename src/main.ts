import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ResponseInterceptor } from 'src/common/interseptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
    // Applique l'intercepteur globalement
    app.useGlobalInterceptors(new ResponseInterceptor());


  // Applique le filtre d'exception globalement
  app.useGlobalFilters(new HttpExceptionFilter());
   // Configure Swagger
   const config = new DocumentBuilder()
   .setTitle('API Documentation')
   .setDescription('Description de l\'API')
   .setVersion('1.0')
   .addBearerAuth()
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
