import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Product } from './products/entities/product.entity';
import { ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
const configService = new ConfigService();
async function bootstrap() {
  const PORT = process.env.PORT || 5001;

  const AppDataSource = new DataSource({
    type: 'postgres',
    host: configService.get('POSTGRES_HOST'),
    port: configService.get('POSTGRES_PORT'),
    username: configService.get('POSTGRES_USER'),
    password: configService.get('POSTGRES_PASSWORD'),
    database: configService.get('POSTGRES_DB'),
    synchronize: true,
    entities: [Product, User],
    subscribers: [],
    migrations: [],
  });

  AppDataSource.initialize().catch((error) => console.log(error));
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Products')
    .setDescription('Documentation for products')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () =>
    console.log(`Server has been started http://localhost:${PORT}`),
  );
}
bootstrap();
