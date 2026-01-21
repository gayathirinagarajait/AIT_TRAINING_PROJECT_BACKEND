import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailQueue, MailQueueDocument } from './mail-queue.schema';
import { sendMail } from '../utils/mail.util';

@Injectable()
export class MailProcessor {
  constructor(
    @InjectModel(MailQueue.name)
    private readonly mailQueueModel: Model<MailQueueDocument>,
  ) {}

  async processQueue() {
    // console.log('Mail Queue Processing Started');

    const pendingMails = await this.mailQueueModel.find({
      status: 'PENDING',
    });

    // console.log(`Found ${pendingMails.length} pending mails`);

    for (const mail of pendingMails) {
      // console.log(' Processing mail:', {
      //   to: mail.to,
      //   subject: mail.subject,
      //   retryCount: mail.retryCount,
      // });

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

        // console.log(`Mail sent successfully to ${mail.to}`);
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : 'Unknown error';

        mail.status = 'FAILED';
        mail.retryCount += 1;
        mail.error = errorMessage;
        await mail.save();

        console.error(' Mail sending failed:', {
          to: mail.to,
          error: errorMessage,
        });
      }
    }

    // console.log(' Mail Queue Processing Completed');
    return { message: 'Mail queue processed' };
  }
}
