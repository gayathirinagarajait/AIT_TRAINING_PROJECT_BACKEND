import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { sendMail } from '../../../modules/utils/mail.util';

@Injectable()
export class CronService {

  // Runs every day at 9 AM
  @Cron('0 9 * * *')
  async sendDailyMail() {
    try {
      await sendMail({
        to: 'test@gmail.com',
        subject: 'Daily Report',
        text: 'This is an automated daily mail from Cron Job',
      });

      console.log('Daily mail sent successfully');
    } catch (error) {
      console.error('Cron mail error:', error);
    }
  }
}
