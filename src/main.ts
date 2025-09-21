import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpExceptionFilter } from './exception-filter/exception-filter.filter';
import { StateService } from './state/state.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));

  const stateService = app.get(StateService)

  await stateService.seed()

  const config = new DocumentBuilder()
    .setTitle('Project library')
    .setDescription('Project library API description')
    .setVersion('1.0')
    .addTag('project-library')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(4200);
}
bootstrap().catch(err => console.error(err));
