import { DataSource } from 'typeorm';
import { Product } from './products/entities/product.entity';
import { ConfigService } from '@nestjs/config';
import { User } from './users/entities/user.entity';
const configService = new ConfigService();

export const AppDataSource = new DataSource({
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
  migrationsTableName: 'custom_migration_table',
});

AppDataSource.initialize().catch((error) => console.log(error));
