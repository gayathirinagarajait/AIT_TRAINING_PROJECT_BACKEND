import { Module } from '@nestjs/common';
import { MailController } from './mail.controller';
import { MailCronService } from './mail.cron';
@Module({
  controllers: [MailController],
  providers: [MailCronService],
})
export class MailModule {}

