import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MailQueue, MailQueueDocument } from './mail-queue.schema';
import { sendMail } from '../utils/mail.util';

@Injectable()
export class MailCronService {
  constructor(
    @InjectModel(MailQueue.name)
    private mailQueueModel: Model<MailQueueDocument>,
  ) {}

 @Cron('*/30 * * * * *')
async processMailQueue() {

  const mail = await this.mailQueueModel.findOneAndUpdate(
    { status: 'PENDING', retryCount: { $lt: 3 } },
    { status: 'PROCESSING' },
    { new: true }
  );

  if (!mail) return;

  try {
    await sendMail({
      to: mail.to,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      attachments: mail.attachments,
    });

    mail.status = 'SENT';
    await mail.save();

  } catch (err: any) {
    mail.retryCount += 1;
    mail.status =
      mail.retryCount >= 3 ? 'FAILED' : 'PENDING';
    mail.error = err?.message || 'Mail failed';
    await mail.save();
  }
 }
}

