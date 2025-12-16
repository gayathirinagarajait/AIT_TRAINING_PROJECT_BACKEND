import { Controller, Post, Body } from '@nestjs/common';
import { sendMail } from '../utils/mail.util';

@Controller('mail')
export class MailController {
  @Post('send')
  async sendEmail(@Body() body: any) {
    try {
      await sendMail({
        to: body.to,
        subject: body.subject,
        text: body.text,
        html: body.html,
      });

      return { message: 'Mail sent successfully' };
    } catch (error) {
      throw error;
    }
  }
}
