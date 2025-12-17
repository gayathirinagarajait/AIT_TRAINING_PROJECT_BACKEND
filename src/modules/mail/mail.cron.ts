import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { sendMail } from '../utils/mail.util';
import { welcomeTemplate } from '../../templates/welcome.template';

@Injectable()
export class MailCronService {

  // Every day at 9 AM
  @Cron('0 9 * * *')
  async sendDailyMail() {
    console.log(' Cron Job Started');

    await sendMail({
      to: 'receiver@gmail.com',
      subject: 'Daily Report',
      html: welcomeTemplate('Gayathri'),
    });

    console.log('Daily mail sent');
  }
}
