import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseConfig } from './config/database.config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/users/user.module';
import { ProductModule } from './modules/products/product.module';
import { MailModule } from './modules/mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CronModule } from './config/common/cron/cron.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseConfig,
    AuthModule,
    UserModule,
    ProductModule,
    MailModule, 
    CronModule,

  ],
})
export class AppModule {}
