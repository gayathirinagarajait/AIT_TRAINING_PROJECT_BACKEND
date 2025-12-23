import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { MailController } from './mail.controller';
import { MailCronService } from './mail.cron';
import { MailQueue, MailQueueSchema } from './mail-queue.schema';
import { MailProcessor } from './mail.processor';


@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([
      { name: MailQueue.name, schema: MailQueueSchema },
    ]),
  ],
  controllers: [MailController],
  providers: [MailCronService,MailProcessor],
})
export class MailModule {}
