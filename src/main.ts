import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { TransformInterceptor } from "./common/interceptors/transform-interceptor";
import { AllExceptionFilter } from "./common/filters/http-exception.filter";
import * as cookieParser from "cookie-parser";

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.setGlobalPrefix("api/v1");

  app.enableCors({
    origin: "http://localhost:3000",
    credentials: true,
  });

  app.useGlobalFilters(new AllExceptionFilter());

  app.useGlobalInterceptors(new TransformInterceptor());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("Catat.In API")
    .setDescription("Track dan catat pengeluaran setiap waktu")
    .setVersion("1.0")
    .addCookieAuth("accessToken")
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup("api/docs", app, document);

  const port = 4000;
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}/api/v1`);
  logger.log(`📚 Swagger docs available at: http://localhost:${port}/api/docs`);
}

bootstrap();
