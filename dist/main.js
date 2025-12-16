"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const dotenv = require("dotenv");
const common_1 = require("@nestjs/common");
async function bootstrap() {
    // Load env based on environment
    dotenv.config({
        path: `.env.${process.env.NODE_ENV || 'development'}`,
    });
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    // Global API prefix
    app.setGlobalPrefix('api');
    // Global validation (future proof – DTO validation)
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true, // remove unwanted fields
        forbidNonWhitelisted: true,
        transform: true,
    }));
    // Enable CORS (required for frontend)
    app.enableCors({
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Server running on http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map