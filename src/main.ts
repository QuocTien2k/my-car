import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3000;

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // field lạ -> báo log
      transform: true, //convert type
      transformOptions: {
        enableImplicitConversion: false, // không convert dạng number => string
      },
      stopAtFirstError: true, //có lỗi thì dừng
    }),
  );

  // Global serialization layer using class-transformer
  // Automatically removes fields marked with @Exclude (e.g. password)
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(port);
  console.log(`🚀 Server running at http://localhost:${port}`);
}
bootstrap();
