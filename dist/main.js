"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./products/entities/product.entity");
const config_1 = require("@nestjs/config");
const user_entity_1 = require("./users/entities/user.entity");
const configService = new config_1.ConfigService();
async function bootstrap() {
    const PORT = process.env.PORT || 5001;
    const AppDataSource = new typeorm_1.DataSource({
        type: 'postgres',
        host: configService.get('POSTGRES_HOST'),
        port: configService.get('POSTGRES_PORT'),
        username: configService.get('POSTGRES_USER'),
        password: configService.get('POSTGRES_PASSWORD'),
        database: configService.get('POSTGRES_DB'),
        synchronize: true,
        entities: [product_entity_1.Product, user_entity_1.User],
        subscribers: [],
        migrations: [],
    });
    AppDataSource.initialize().catch((error) => console.log(error));
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Products')
        .setDescription('Documentation for products')
        .setVersion('1.0.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('/api/docs', app, document);
    await app.listen(PORT, () => console.log(`Server has been started http://localhost:${PORT}`));
}
bootstrap();
//# sourceMappingURL=main.js.map